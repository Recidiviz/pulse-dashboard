// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { COLORS } from '../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../assets/scripts/utils/downloads';
import geographyObject from '../../assets/static/maps/us_nd.json';
import { colorForValue } from '../../utils/charts/choropleth';
import { toHtmlFriendly } from '../../utils/transforms/labels';

const minMarkerRadius = 10;
const maxMarkerRadius = 35;

const METRIC_PERIODS = ['1', '3', '6', '12', '36'];

const RATIO_CONTAINER_OUTER_STYLE = {
  position: 'relative',
  height: 0,
  paddingBottom: '50%',
};

const RATIO_CONTAINER_INNER_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

function normalizedOfficeKey(officeName) {
  let normalized = toHtmlFriendly(officeName).toLowerCase();
  normalized = normalized.replace(/-/g, '_');

  return normalized;
}

function normalizedDistrictId(district) {
  let normalized = String(district).toLowerCase();
  normalized = normalized.replace(/-/g, '_');
  normalized = normalized.replace(/ /g, '_');

  return normalized;
}

function normalizedSupervisionTypeKey(supervisionType) {
  if (!supervisionType) {
    return 'none';
  }
  return supervisionType.toLowerCase();
}

function normalizedCountyName(geographyNameForCounty, stateCode) {
  let normalized = String(geographyNameForCounty).toLowerCase();
  normalized = normalized.replace(/ /g, '_');
  return `${stateCode}_${normalized}`;
}

function getOfficeForCounty(offices, geographyNameForCounty, stateCode) {
  const countyName = normalizedCountyName(geographyNameForCounty, stateCode);
  return offices[countyName];
}

function getOfficeDataValue(office, metricType, metricPeriodMonths, supervisionType) {
  const supervisionTypeKey = normalizedSupervisionTypeKey(supervisionType);

  if (!office.dataValues[metricPeriodMonths]) {
    return 0;
  }
  if (!office.dataValues[metricPeriodMonths][supervisionTypeKey]) {
    return 0;
  }

  if (metricType === 'counts') {
    return office.dataValues[metricPeriodMonths][supervisionTypeKey].numerator;
  }

  return office.dataValues[metricPeriodMonths][supervisionTypeKey].rate;
}

function relatedMaxValue(maxValues, metricType, metricPeriodMonths, supervisionTypeKey) {
  const valueKey = metricType === 'counts' ? 'numerator' : 'rate';
  return maxValues[metricPeriodMonths][supervisionTypeKey][valueKey];
}

/**
 * Returns the radius pixel size for the marker of the given office.
 * The size of the markers are distributed a linear scale given the count or
 * rate of the offices, where the office with the highest number or percentage of
 * numerator events will have a marker with the radius size of `maxMarkerRadius`.
 */
function radiusOfMarker(office, maxValues, metricType, metricPeriodMonths, supervisionType) {
  const supervisionTypeKey = normalizedSupervisionTypeKey(supervisionType);
  const maxValue = relatedMaxValue(maxValues, metricType, metricPeriodMonths, supervisionTypeKey);

  const officeScale = scaleLinear()
    .domain([0, maxValue])
    .range([minMarkerRadius, maxMarkerRadius]);

  const dataValue = getOfficeDataValue(office, metricType, metricPeriodMonths, supervisionType);
  // We use the absolute value so that the radius is tied to distance away from 0.
  // An alternative to consider is making the domain of the scale the minimum value, but this fits
  // the only negative value use case we have right now: LSIR Score Change, where large negative
  // values should lead to large radii.
  return officeScale(Math.abs(dataValue));
}

function toggleTooltip(office, metricType, metricPeriodMonths, supervisionType) {
  let value = 0;
  if (office) {
    value = getOfficeDataValue(office, metricType, metricPeriodMonths, supervisionType);
  }

  if (metricType === 'counts') {
    return `${office.officeName}: ${value}`;
  }

  return `${office.officeName}: ${value}%`;
}

function toggleTooltipForCounty(
  offices, geographyNameForCounty, metricType, metricPeriodMonths, supervisionType, stateCode,
) {
  const countyName = normalizedCountyName(geographyNameForCounty, stateCode);
  const office = offices[countyName];

  let value = 0;
  if (office) {
    value = getOfficeDataValue(office, metricType, metricPeriodMonths, supervisionType);
  }

  if (metricType === 'counts') {
    return `${geographyNameForCounty}: ${value}`;
  }
  return `${geographyNameForCounty}: ${value}%`;
}

function colorForMarker(
  office, maxValues, metricType, metricPeriodMonths, supervisionType, useDarkMode, possibleNegative,
) {
  const supervisionTypeKey = normalizedSupervisionTypeKey(supervisionType);

  let dataValue = 0;
  if (office) {
    dataValue = getOfficeDataValue(office, metricType, metricPeriodMonths, supervisionType);
  }
  const maxValue = relatedMaxValue(maxValues, metricType, metricPeriodMonths, supervisionTypeKey);

  return colorForValue(dataValue, maxValue, useDarkMode, possibleNegative);
}

function sortChartDataPoints(dataPoints, metricType, metricPeriodMonths, supervisionType) {
  return dataPoints.sort((a, b) => (
    getOfficeDataValue(b, metricType, metricPeriodMonths, supervisionType)
    - getOfficeDataValue(a, metricType, metricPeriodMonths, supervisionType)));
}

class GeoViewTimeChart extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.initializeChartData = this.initializeChartData.bind(this);
    this.initializeChartData();
  }

  componentDidMount() {
    this.initializeChartData();
    this.reconfigureExports();

    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  }

  componentDidUpdate(prevProps, prevState) {
    this.reconfigureExports();
  }

  setEmptyOfficeData(office) {
    METRIC_PERIODS.forEach((metricPeriodMonths) => {
      office.dataValues[metricPeriodMonths] = {
        none: { numerator: 0, denominator: 0, rate: 0.00 },
        all: { numerator: 0, denominator: 0, rate: 0.00 },
        parole: { numerator: 0, denominator: 0, rate: 0.00 },
        probation: { numerator: 0, denominator: 0, rate: 0.00 },
      };
    });
  }

  reconfigureExports() {
    const exportedStructureCallback = () => (
      {
        metric: 'Events by P&P office',
        series: [],
      });

    const dataPointsByOffice = [];
    const officeNames = [];
    this.chartDataPoints.forEach((data) => {
      const { officeName } = data;
      const officeDataValue = getOfficeDataValue(
        data, this.props.metricType, this.props.metricPeriodMonths, this.props.supervisionType,
      );

      officeNames.push(officeName);
      dataPointsByOffice.push(officeDataValue);
    });

    const downloadableDataFormat = [{
      data: dataPointsByOffice,
      label: 'Event count',
    }];

    configureDownloadButtons(this.props.chartId, this.props.chartTitle,
      downloadableDataFormat, officeNames, document.getElementById(this.props.chartId),
      exportedStructureCallback, this.props);
  }

  initializeMaxValues() {
    this.maxValues = {};
    METRIC_PERIODS.forEach((metricPeriodMonths) => {
      this.maxValues[metricPeriodMonths] = {
        none: { numerator: -1e100, rate: -1e100 },
        all: { numerator: -1e100, rate: -1e100 },
        parole: { numerator: -1e100, rate: -1e100 },
        probation: { numerator: -1e100, rate: -1e100 },
      }
    });
  }

  initializeChartData() {
    const {
      officeData, dataPointsByOffice, numeratorKeys, denominatorKeys, shareDenominatorAcrossRates,
    } = this.props;

    this.officeData = officeData;
    this.dataPointsByOffice = dataPointsByOffice;
    this.offices = {};
    this.officeKeys = [];
    this.initializeMaxValues();

    if (this.officeData) {
      // Load office metadata from explicit dataset
      this.officeData.forEach((officeData) => {
        const {
          district,
          site_name: name,
          long: longValue,
          lat: latValue,
          title_side: titleSideValue,
        } = officeData;
        const districtId = normalizedDistrictId(district);

        const office = {
          district: districtId,
          officeName: name,
          coordinates: [longValue, latValue],
          titleSide: titleSideValue,
          dataValues: {},
        };

        const officeNameKey = normalizedOfficeKey(name);
        this.offices[districtId] = office;
        this.officeKeys.push(officeNameKey);
      });
    } else {
      // Load office metadata from district labels provided in the value dataset
      this.dataPointsByOffice.forEach((data) => {
        const { district } = data;

        const officeNameKey = normalizedOfficeKey(district);
        const office = this.offices[officeNameKey];
        if (!office) {
          const newOffice = {
            officeName: district,
            dataValues: {},
          };

          this.offices[officeNameKey] = newOffice;
          this.officeKeys.push(officeNameKey);
        }
      });
    }

    // If configured as such, calculate a denominator summed across the ALL-district datapoints,
    // to be shared for all rate calculations
    const totalDenominatorByMetricPeriod = {};
    if (shareDenominatorAcrossRates) {
      this.dataPointsByOffice.forEach((data) => {
        const { metric_period_months: metricPeriodMonths } = data;

        let denominator = 0;
        denominatorKeys.forEach((key) => {
          denominator += Number(data[key] || 0);
        });

        if (!totalDenominatorByMetricPeriod[metricPeriodMonths]) {
          totalDenominatorByMetricPeriod[metricPeriodMonths] = denominator;
        } else {
          totalDenominatorByMetricPeriod[metricPeriodMonths] += denominator;
        }
      });
    }

    // Load data for each office
    this.chartDataPoints = [];
    this.officeKeysWithData = [];
    if (this.dataPointsByOffice) {
      this.dataPointsByOffice.forEach((data) => {
        const {
          district,
          metric_period_months: metricPeriodMonths,
          supervision_type: supervisionType,
        } = data;
        const districtId = normalizedDistrictId(district);

        // The API response providing data to this geo view chart might include rows with
        // district=ALL, e.g. if the response is shared with a non-geo chart. Skip over these rows.
        if (districtId === 'all') {
          return;
        }

        // The API response included data points for a district not in the list of site offices
        if (!this.offices[districtId]) {
          return;
        }

        const { officeName } = this.offices[districtId];
        const officeNameKey = normalizedOfficeKey(officeName);
        const supervisionTypeKey = normalizedSupervisionTypeKey(supervisionType);

        const office = this.offices[districtId];
        if (office) {
          if (!office.dataValues[metricPeriodMonths]) {
            office.dataValues[metricPeriodMonths] = {
              none: { numerator: 0, denominator: 0, rate: 0.00 },
              all: { numerator: 0, denominator: 0, rate: 0.00 },
              parole: { numerator: 0, denominator: 0, rate: 0.00 },
              probation: { numerator: 0, denominator: 0, rate: 0.00 },
            };
          }
          if (!office.dataValues[metricPeriodMonths][supervisionTypeKey]) {
            office.dataValues[metricPeriodMonths][supervisionTypeKey] = {};
          }

          let numerator = 0;
          numeratorKeys.forEach((key) => {
            numerator += Number(data[key] || 0);
          });

          let denominator = 0;
          denominatorKeys.forEach((key) => {
            denominator += Number(data[key] || 0);
          });

          if (shareDenominatorAcrossRates) {
            denominator = totalDenominatorByMetricPeriod[metricPeriodMonths];
          }

          if (numerator === 0 && (denominator === 0 && denominatorKeys.length > 0)) {
            return;
          }

          let rate = 0.0;
          if (denominator !== 0 && denominatorKeys.length > 0) {
            rate = (100 * (numerator / denominator));
          }
          const rateFixed = rate.toFixed(2);

          office.dataValues[metricPeriodMonths][supervisionTypeKey] = {
            numerator,
            denominator,
            rate: rateFixed,
          };

          if (!this.officeKeysWithData.includes(officeNameKey)) {
            this.chartDataPoints.push(office);
            this.officeKeysWithData.push(officeNameKey);
          }

          const numeratorAbs = Math.abs(numerator);
          if (numeratorAbs > this.maxValues[metricPeriodMonths][supervisionTypeKey].numerator) {
            this.maxValues[metricPeriodMonths][supervisionTypeKey].numerator = numeratorAbs;
          }
          if (rate > this.maxValues[metricPeriodMonths][supervisionTypeKey].rate) {
            this.maxValues[metricPeriodMonths][supervisionTypeKey].rate = rate;
          }
        }
      });
    }

    // Set the count to 0 for offices without data
    const officeKeysWithoutData = this.officeKeys.filter((value) => (
      !this.officeKeysWithData.includes(value)));

    officeKeysWithoutData.forEach((officeKey) => {
      const office = this.offices[officeKey];
      if (office) {
        this.setEmptyOfficeData(office);
        this.chartDataPoints.push(office);
      }
    });

    const { metricType, metricPeriodMonths, supervisionType } = this.props;
    sortChartDataPoints(this.chartDataPoints, metricType, metricPeriodMonths, supervisionType);
  }

  render() {
    const {
      metricType, metricPeriodMonths, supervisionType,
      keyedByOffice, centerLong, centerLat, chartId, stateCode,
      possibleNegativeValues,
    } = this.props;

    const sortedDataPoints = sortChartDataPoints(
      this.chartDataPoints, metricType, metricPeriodMonths, supervisionType,
    );

    if (keyedByOffice) {
      // Show a choropleth map with colored, sized circles for P&P offices
      return (
        <div className="map-container" style={RATIO_CONTAINER_OUTER_STYLE}>
          <div style={RATIO_CONTAINER_INNER_STYLE}>
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
              <ZoomableGroup center={[centerLong, centerLat]} zoom={8.2}>
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
                  {sortedDataPoints.map((office) => (
                    <Marker
                      key={office.officeName}
                      marker={office}
                      style={{
                        default: {
                          fill: colorForMarker(office, this.maxValues, metricType, metricPeriodMonths, supervisionType, true, possibleNegativeValues),
                          stroke: '#F5F6F7',
                          strokeWidth: '3',
                        },
                        hover: { fill: COLORS['blue-standard'] },
                        pressed: { fill: COLORS['blue-standard'] },
                      }}
                    >
                      <circle
                        data-tip={toggleTooltip(office, metricType, metricPeriodMonths, supervisionType)}
                        cx={0}
                        cy={0}
                        r={radiusOfMarker(office, this.maxValues, metricType, metricPeriodMonths, supervisionType)}
                      />
                    </Marker>
                  ))}
                </Markers>
              </ZoomableGroup>
            </ComposableMap>
            <ReactTooltip />
          </div>
        </div>
      );
    }

    // Show just a regular choropleth, with no circles for offices
    return (
      <div id={chartId} className="map-container" style={RATIO_CONTAINER_OUTER_STYLE}>
        <div style={RATIO_CONTAINER_INNER_STYLE}>
          <ComposableMap
            projection={geoAlbersUsa}
            projectionConfig={{ scale: 1000 }}
            width={980}
            height={500}
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <ZoomableGroup center={[centerLong, centerLat]} zoom={7} disablePanning>
              <Geographies geography={geographyObject} disableOptimization>
                {(geographies, projection) => geographies.map((geography) => (
                  <Geography
                    key={geography.properties.NAME}
                    data-tip={toggleTooltipForCounty(this.offices, geography.properties.NAME, metricType, metricPeriodMonths, supervisionType, stateCode)}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: colorForMarker(getOfficeForCounty(this.offices, geography.properties.NAME, stateCode), this.maxValues, metricType, metricPeriodMonths, supervisionType, false, possibleNegativeValues),
                        stroke: COLORS['grey-700'],
                        strokeWidth: 0.2,
                        outline: 'none',
                      },
                      hover: {
                        fill: colorForMarker(getOfficeForCounty(this.offices, geography.properties.NAME, stateCode), this.maxValues, metricType, metricPeriodMonths, supervisionType, true, possibleNegativeValues),
                        stroke: COLORS['grey-700'],
                        strokeWidth: 0.2,
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#CFD8DC',
                        stroke: COLORS['grey-700'],
                        strokeWidth: 0.2,
                        outline: 'none',
                      },
                    }}
                  />
                ))}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          <ReactTooltip />
        </div>
      </div>
    );
  }
}

export default GeoViewTimeChart;
