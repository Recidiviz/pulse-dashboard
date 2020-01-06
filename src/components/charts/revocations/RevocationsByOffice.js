// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import React, { Component } from 'react';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import { geoAlbersUsa } from 'd3-geo';
import { scaleLinear } from 'd3-scale';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import geographyObject from '../../../assets/static/maps/us_nd.json';
import { toHtmlFriendly, toInt } from '../../../utils/transforms/labels';

const chartId = 'revocationsByOffice';
const centerNDLong = -100.5;
const centerNDLat = 47.3;

const TIME_WINDOWS = ['1m', '3m', '6m', '1y', '3y'];

function getOfficeDataValue(office, metricType, timeWindow, supervisionType) {
  const supervisionTypeKey = supervisionType.toLowerCase();
  if (metricType === 'counts') {
    if (supervisionTypeKey === 'all') {
      return office.revocationValues[timeWindow].parole.revocationCount + office.revocationValues[timeWindow].probation.revocationCount;
    }
    return office.revocationValues[timeWindow][supervisionTypeKey].revocationCount;
  }

  if (supervisionType === 'all') {
    const paroleCount = office.revocationValues[timeWindow].parole.revocationCount;
    const probationCount = office.revocationValues[timeWindow].probation.revocationCount;
    const { supervisionCount } = office.revocationValues[timeWindow].probation;

    return (100 * ((paroleCount + probationCount) / supervisionCount)).toFixed(2);
  }
  return office.revocationValues[timeWindow][supervisionTypeKey].revocationRate;
}

/**
 * Returns the radius pixel size for the marker of the given office.
 * The size of the markers are distributed a linear scale given the revocation count or
 * rate of the offices, where the office with the highest number or percentage of
 * revocations will have a marker with the radius size of `maxMarkerRadius`.
 */
function radiusOfMarker(office, maxValues, metricType, timeWindow, supervisionType) {
  const minMarkerRadius = 10;
  const maxMarkerRadius = 35;

  const maxValue = metricType === 'counts'
    ? maxValues[timeWindow].count : maxValues[timeWindow].rate;

  const officeScale = scaleLinear()
    .domain([0, maxValue])
    .range([minMarkerRadius, maxMarkerRadius]);

  return officeScale(getOfficeDataValue(office, metricType, timeWindow, supervisionType));
}

function toggleTooltip(office, metricType, timeWindow, supervisionType) {
  const value = getOfficeDataValue(office, metricType, timeWindow, supervisionType);
  if (metricType === 'counts') {
    return `${office.officeName}: ${value}`;
  }

  return `${office.officeName}: ${value}%`;
}

function colorForMarker(office, metricType, timeWindow, supervisionType) {
  const value = getOfficeDataValue(office, metricType, timeWindow, supervisionType);

  return value > 0 ? COLORS['red-standard'] : COLORS['grey-400'];
}

function sortChartDataPoints(dataPoints, metricType, timeWindow, supervisionType) {
  return dataPoints.sort((a, b) => (getOfficeDataValue(b, metricType, timeWindow, supervisionType)
    - getOfficeDataValue(a, metricType, timeWindow, supervisionType)));
}

class RevocationsByOffice extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.initializeChartData = this.initializeChartData.bind(this);
    this.initializeChartData();
  }

  componentDidMount() {
    this.initializeChartData();

    const exportedStructureCallback = () => (
      {
        metric: 'Revocations by P&P office',
        series: [],
      });

    const revocationsByOffice = [];
    const officeNames = [];
    this.chartDataPoints.forEach((data) => {
      const {
        officeName,
        revocationCount,
        revocationRate,
      } = data;

      officeNames.push(officeName);
      if (this.props.metricType === 'counts') {
        revocationsByOffice.push(revocationCount);
      } else if (this.props.metricType === 'rates') {
        revocationsByOffice.push(revocationRate);
      }
    });

    const downloadableDataFormat = [{
      data: revocationsByOffice,
      label: 'Revocation count',
    }];

    configureDownloadButtons(chartId, 'REVOCATIONS BY P&P OFFICE - 60 DAYS',
      downloadableDataFormat, officeNames,
      document.getElementById(chartId), exportedStructureCallback);

    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  }

  setEmptyOfficeData(office) {
    TIME_WINDOWS.forEach((window) => {
      office.revocationValues[window] = {
        parole: {
          revocationCount: 0, supervisionCount: 0, revocationRate: 0.00,
        },
        probation: {
          revocationCount: 0, supervisionCount: 0, revocationRate: 0.00,
        },
      };
    });
    office.officerDropdownItemId = `${this.officerDropdownId}-${toHtmlFriendly(office.officeName).toLowerCase()}`;
  }

  initializeChartData() {
    this.officeData = this.props.officeData;
    this.revocationsByOffice = this.props.revocationsByOffice;
    this.officerDropdownId = this.props.officerDropdownId;
    this.offices = {};
    this.officeIds = [];
    this.maxValues = {
      '1m': { count: -1e100, rate: -1e100 },
      '3m': { count: -1e100, rate: -1e100 },
      '6m': { count: -1e100, rate: -1e100 },
      '1y': { count: -1e100, rate: -1e100 },
      '3y': { count: -1e100, rate: -1e100 },
    };

    if (this.officeData) {
      // Load office metadata
      this.officeData.forEach((officeData) => {
        const {
          site_id: officeId,
          site_name: name,
          long: longValue,
          lat: latValue,
          title_side: titleSideValue,
        } = officeData;

        const office = {
          officeName: name,
          coordinates: [longValue, latValue],
          titleSide: titleSideValue,
          revocationValues: {},
        };

        this.offices[officeId] = office;
        this.officeIds.push(officeId);
      });
    }

    // Load revocation data for each office
    this.chartDataPoints = [];
    this.officeIdsWithData = [];
    if (this.revocationsByOffice) {
      this.revocationsByOffice.forEach((data) => {
        const {
          site_id: officeId,
          absconsion_count: absconsionCount,
          felony_count: felonyCount,
          technical_count: technicalCount,
          unknown_count: unknownCount,
          total_supervision_count: supervisionCount,
          time_window: timeWindow,
          supervision_type: supervisionType,
        } = data;

        const revocationCountNum = toInt(absconsionCount)
          + toInt(felonyCount) + toInt(technicalCount) + toInt(unknownCount);
        const officeIdInt = toInt(officeId);
        const office = this.offices[officeIdInt];

        const supervisionTypeKey = supervisionType.toLowerCase();
        if (office) {
          const revocationCount = revocationCountNum;
          const revocationRate = (100 * (revocationCountNum / supervisionCount));
          const revocationRateFixed = revocationRate.toFixed(2);

          office.officerDropdownItemId = `${this.officerDropdownId}-${toHtmlFriendly(office.officeName).toLowerCase()}`;

          if (!office.revocationValues[timeWindow]) {
            office.revocationValues[timeWindow] = {};
          }
          if (!office.revocationValues[timeWindow][supervisionTypeKey]) {
            office.revocationValues[timeWindow][supervisionTypeKey] = {};
          }

          office.revocationValues[timeWindow][supervisionTypeKey] = {
            revocationCount,
            supervisionCount,
            revocationRate: revocationRateFixed,
          };

          if (!this.officeIdsWithData.includes(officeIdInt)) {
            this.chartDataPoints.push(office);
            this.officeIdsWithData.push(officeIdInt);
          }

          if (revocationCount > this.maxValues[timeWindow].count) {
            this.maxValues[timeWindow].count = office.revocationValues[timeWindow][supervisionTypeKey].revocationCount;
          }
          if (revocationRate > this.maxValues[timeWindow].rate) {
            this.maxValues[timeWindow].rate = office.revocationValues[timeWindow][supervisionTypeKey].revocationRate;
          }
        }
      });
    }

    // Set the revocation count to 0 for offices without data
    const officeIdsWithoutData = this.officeIds.filter((value) => (
      !this.officeIdsWithData.includes(value)));

    officeIdsWithoutData.forEach((officeId) => {
      const office = this.offices[officeId];
      if (office) {
        this.setEmptyOfficeData(office);
        this.chartDataPoints.push(office);
      }
    });

    // Sort descending by revocationCount so that offices with fewer revocations
    // will be on top
    const { metricType, timeWindow, supervisionType } = this.props;
    sortChartDataPoints(this.chartDataPoints, metricType, timeWindow, supervisionType);
  }

  render() {
    return (
      <div className="map-container">
        <ComposableMap
          projection={geoAlbersUsa}
          projectionConfig={{ scale: 1000 }}
          width={980}
          height={580}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={[centerNDLong, centerNDLat]} zoom={8.2} disablePanning>
            <Geographies geography={geographyObject}>
              {(geographies, projection) => geographies.map((geography) => (
                <Geography
                  key={geography.properties.NAME}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: '#F5F6F7',
                      stroke: COLORS['grey-300'],
                      strokeWidth: 0.2,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#F5F6F7',
                      stroke: COLORS['grey-300'],
                      strokeWidth: 0.2,
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#F5F6F7',
                      stroke: COLORS['grey-300'],
                      strokeWidth: 0.2,
                      outline: 'none',
                    },
                  }}
                />
              ))
              }
            </Geographies>
            <Markers>
              {this.chartDataPoints.map((office) => (
                <Marker
                  key={office.officeName}
                  marker={office}
                  style={{
                    default: {
                      fill: colorForMarker(office, this.props.metricType, this.props.timeWindow, this.props.supervisionType),
                      stroke: '#F5F6F7',
                      strokeWidth: '3',
                    },
                    hover: { fill: COLORS['blue-standard'] },
                    pressed: { fill: COLORS['blue-standard'] },
                  }}
                >
                  <circle
                    data-tip={toggleTooltip(office, this.props.metricType, this.props.timeWindow, this.props.supervisionType)}
                    cx={0}
                    cy={0}
                    r={radiusOfMarker(office, this.maxValues, this.props.metricType, this.props.timeWindow, this.props.supervisionType)}
                  />
                </Marker>
              ))}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip />
      </div>
    );
  }
}

export default RevocationsByOffice;
