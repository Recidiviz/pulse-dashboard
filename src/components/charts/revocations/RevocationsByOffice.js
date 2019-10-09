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
import { geoAlbersUsa } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
import geographyObject from '../../../assets/static/maps/us_nd.json';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import { toHtmlFriendly, toInt } from '../../../utils/variableConversion';

const chartId = 'revocationsByOffice';
const centerNDLong = -100.5;
const centerNDLat = 47.3;

/**
 * Returns the radius pixel size for the marker of the given office.
 * The size of the markers are distributed a linear scale given the revocation
 * count of the offices, where the office with the highest number of revocations
 * will have a marker with the radius size of `maxMarkerRadius`.
 */
function radiusOfMarker(office, maxValue) {
  const minMarkerRadius = 3;
  const maxMarkerRadius = 25;
  const officeScale = scaleLinear()
    .domain([0, maxValue])
    .range([minMarkerRadius, maxMarkerRadius]);

  return officeScale(office.revocationCount);
}

/**
 * Returns how far the title should be offset (in pixels) along the x-axis from
 * the center of the marker circle, given the location of the title, the
 * length of the office name, and the number of revocations.
 */
function xOffsetForOfficeTitle(office, markerRadius) {
  const offsetPerRevocationDigit = 10;
  const offsetForParenthesis = 15;
  const offsetForNameLetter = 8;
  const digitsInRevocations = office.revocationCount.toString().length;
  const revLabelOffset = offsetPerRevocationDigit * digitsInRevocations + offsetForParenthesis;
  if (office.titleSide === 'left') {
    return (-1 * markerRadius)
      - (office.officeName.length * offsetForNameLetter) - revLabelOffset;
  }

  if (office.titleSide === 'right') {
    return markerRadius
     + (office.officeName.length * offsetForNameLetter) + revLabelOffset;
  }

  return 0;
}

/**
 * Returns how far the title should be offset (in pixels) along the y-axis from
 * the center of the marker circle given the location of the title.
 */
function yOffsetForOfficeTitle(office, markerRadius) {
  const offsetForBottomLabels = 25;
  const offsetForAllLables = 10;
  if (office.titleSide === 'bottom') {
    return markerRadius + offsetForBottomLabels;
  }

  if (office.titleSide === 'top') {
    return -1 * markerRadius - offsetForAllLables;
  }

  return offsetForAllLables;
}

function colorForMarker(office) {
  return (office.revocationCount > 0) ? COLORS['red-standard'] : COLORS['grey-600'];
}

const officeClicked = (office) => {
  const officeDropdownItem = document.getElementById(office.officerDropdownItemId);
  if (officeDropdownItem) {
    officeDropdownItem.click();
  }
};

class RevocationsByOffice extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.officeData = this.props.officeData;
    this.revocationsByOffice = this.props.revocationsByOffice;
    this.officerDropdownId = this.props.officerDropdownId;
    this.offices = {};
    this.officeIds = [];
    this.maxValue = -1e100;

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
        } = data;

        const revocationCountNum = toInt(absconsionCount)
          + toInt(felonyCount) + toInt(technicalCount) + toInt(unknownCount);
        const officeIdInt = toInt(officeId);
        const office = this.offices[officeIdInt];
        if (office) {
          office.revocationCount = revocationCountNum;
          office.officerDropdownItemId = `${this.officerDropdownId}-${toHtmlFriendly(office.officeName)}`;
          this.chartDataPoints.push(office);
          this.officeIdsWithData.push(officeIdInt);

          if (office.revocationCount > this.maxValue) {
            this.maxValue = office.revocationCount;
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
        office.revocationCount = 0;
        office.officerDropdownItemId = `${this.officerDropdownId}-${toHtmlFriendly(office.officeName)}`;
        this.chartDataPoints.push(office);
      }
    });
  }

  componentDidMount() {
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
      } = data;
      revocationsByOffice.push(revocationCount);
      officeNames.push(officeName);
    });

    const downloadableDataFormat = [{
      data: revocationsByOffice,
      label: chartId,
    }];

    configureDownloadButtons(chartId, downloadableDataFormat,
      officeNames,
      document.getElementById(chartId), exportedStructureCallback);
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
              {(geographies, projection) => geographies.map((geography, i) => (
                <Geography
                  key={i}
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
              {this.chartDataPoints.map((office, i) => (
                <Marker
                  onClick={officeClicked}
                  key={i}
                  marker={office}
                  style={{
                    default: { fill: colorForMarker(office) },
                    hover: { fill: COLORS['blue-standard'] },
                    pressed: { fill: COLORS['blue-standard'] },
                  }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={radiusOfMarker(office, this.maxValue)}
                  />
                  <text
                    textAnchor="middle"
                    x={xOffsetForOfficeTitle(office, radiusOfMarker(office, this.maxValue))}
                    y={yOffsetForOfficeTitle(office, radiusOfMarker(office, this.maxValue))}
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: '175%',
                      fontWeight: '900',
                      fill: '#607D8B',
                    }}
                  >
                    {office.officeName.concat(' (', office.revocationCount, ')')}
                  </text>
                </Marker>
              ))}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default RevocationsByOffice;
