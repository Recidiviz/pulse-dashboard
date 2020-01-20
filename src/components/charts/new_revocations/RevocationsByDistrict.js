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

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import ExportMenu from '../ExportMenu';

import * as $ from 'jquery';

import { COLORS } from '../../../assets/scripts/constants/colors';
import { toInt } from '../../../utils/transforms/labels';

const chartId = 'revocationsByDistrict';

const RevocationsByDistrict = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [countModeEnabled, setCountModeEnabled] = useState(true);

  const processResponse = () => {
    const districtToCount = props.data.reduce(
      (result, { district, population_count: populationCount }) => {
        return { ...result, [district]: (result[district] || 0) + (toInt(populationCount) || 0) };
      }, {},
    );

    const supervisionDistributions = props.supervisionPopulation.reduce(
      (result, { district, total_population: totalPopulation }) => {
        return { ...result, [district]: (result[district] || 0) + (toInt(totalPopulation) || 0) };
      }, {},
    );

    const labels = Object.keys(districtToCount);
    const displayLabels = labels.map((label) => `District ${label}`);

    let dataPoints = [];
    if (countModeEnabled) {
      dataPoints = labels.map((district) => districtToCount[district]);
    } else {
      dataPoints = labels.map(
        (district) => (100 * (districtToCount[district] / supervisionDistributions[district])).toFixed(2),
      );
    }

    setChartLabels(displayLabels);
    setChartDataPoints(dataPoints);
  };

  // TODO: Replace this jQuery usage with a more React-friendly approach
  $('#modeButtons :input').change(function () {
    const clickedCount = this.value.toLowerCase() === 'counts';
    setCountModeEnabled(clickedCount);
  });

  useEffect(() => {
    processResponse();
  }, [
    props.data,
    countModeEnabled,
  ]);

  // TODO: Replace this with the toggles.js functionality when merged in the other PR
  function toggleLabel(labelsByToggle, toggledValue) {
    if (labelsByToggle[toggledValue]) {
      return labelsByToggle[toggledValue];
    }

    return 'No label found';
  }

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: toggleLabel({
            counts: 'Revocations', rates: 'Revocation rate',
          }, countModeEnabled ? 'counts' : 'rates'),
          backgroundColor: COLORS['orange-500'],
          hoverBackgroundColor: COLORS['orange-500'],
          hoverBorderColor: COLORS['orange-500'],
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
        },
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'District',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: toggleLabel({
                counts: '# of revocations', rates: 'revocation rate',
              }, countModeEnabled ? 'counts' : 'rates'),
            },
            stacked: true,
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
        },
      }}
    />
  );

  return (
    <div>
      <h4 className="pB-20">
        Revocations by district
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by district"
        />
      </h4>

      <div id="modeButtons" className="pB-20 btn-group btn-group-toggle" data-toggle="buttons">
        <label id="countModeButton" className="btn btn-sm btn-outline-primary active">
          <input type="radio" name="modes" id="countMode" value="counts" autoComplete="off" />
          Revocation count
        </label>
        <label id="rateModeButton" className="btn btn-sm btn-outline-primary">
          <input type="radio" name="modes" id="rateMode" value="rates" autoComplete="off" />
          Revocation rate
        </label>
      </div>

      {chart}
    </div>
  );
};

export default RevocationsByDistrict;
