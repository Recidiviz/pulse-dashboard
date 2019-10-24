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
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';
import { geoAlbersUsa } from 'd3-geo';
import geographyObject from '../../../assets/static/maps/us_nd.json';
import { COLORS } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import { colorForValue, countyNameFromCode } from '../../../utils/choroplethUtils';

const chartId = 'revocationRateByCounty';

const centerNDLong = -100.5;
const centerNDLat = 47.3;

function revocationRateForCounty(chartDataPoints, countyName) {
  const revocationRate = chartDataPoints[countyName.toUpperCase()];
  if (revocationRate) {
    return revocationRate.toFixed(2);
  }

  return 0;
}

function valueCountsForCounty(officeValues, countyName) {
  const officeNumbers = officeValues[countyName.toUpperCase()];
  if (officeNumbers) {
    return `${officeNumbers.revocationCount}/${officeNumbers.populationCount}`;
  }

  return '0/0';
}

class RevocationsByCounty extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.revocationRateByCounty = this.props.revocationRateByCounty;
    this.chartDataPoints = {};
    this.officeValues = {};
    this.maxValue = -1e100;

    if (this.revocationRateByCounty) {
      this.revocationRateByCounty.forEach((data) => {
        const {
          state_code: stateCode,
          county_code: countyCode,
          revocation_count: revocationCount,
          population_count: populationCount,
          revocation_rate: revocationRate,
        } = data;

        const revocationRateNum = 100 * Number(revocationRate);

        if (countyCode !== 'UNKNOWN_COUNTY') {
          if (revocationRateNum > this.maxValue) {
            this.maxValue = revocationRateNum;
          }
          const standardCountyName = countyNameFromCode(stateCode, countyCode);
          this.chartDataPoints[standardCountyName] = revocationRateNum;
          this.officeValues[standardCountyName] = {
            revocationCount, populationCount,
          };
        }
      });
    }
  }

  componentDidMount() {
    const exportedStructureCallback = () => (
      {
        metric: 'Revocation rate by county of residence',
        series: [],
      });

    const downloadableDataFormat = [{
      data: Object.values(this.chartDataPoints),
      label: chartId,
    }];

    configureDownloadButtons(chartId, downloadableDataFormat,
      Object.keys(this.chartDataPoints),
      document.getElementById(chartId), exportedStructureCallback);

    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  }

  render() {
    return (
      <div className="map-container" id={chartId}>
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
          <ZoomableGroup center={[centerNDLong, centerNDLat]} zoom={7} disablePanning>
            <Geographies geography={geographyObject}>
              {(geographies, projection) => geographies.map((geography) => (
                <Geography
                  key={geography.properties.NAME}
                  data-tip={geography.properties.NAME
                    + ': '.concat(revocationRateForCounty(this.chartDataPoints, geography.properties.NAME),
                      '% (', valueCountsForCounty(this.officeValues, geography.properties.NAME), ')')}
                  geography={geography}
                  projection={projection}
                  style={{
                    default: {
                      fill: colorForValue(
                        revocationRateForCounty(this.chartDataPoints, geography.properties.NAME),
                        this.maxValue, false,
                      ),
                      stroke: COLORS['grey-700'],
                      strokeWidth: 0.2,
                      outline: 'none',
                    },
                    hover: {
                      fill: colorForValue(
                        revocationRateForCounty(this.chartDataPoints, geography.properties.NAME),
                        this.maxValue, true,
                      ),
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
              ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip />
      </div>
    );
  }
}

export default RevocationsByCounty;
