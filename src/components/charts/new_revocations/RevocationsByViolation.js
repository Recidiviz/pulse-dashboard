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

import { COLORS } from '../../../assets/scripts/constants/colors';
import { toInt, humanReadableTitleCase } from '../../../utils/transforms/labels';

const chartId = 'revocationsByViolationType';

const RevocationsByViolation = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const violationToCount = props.data.reduce(
      (result, { violation_observed: violationObserved, total_violations: totalViolations }) => {
        return { ...result, [violationObserved]: (result[violationObserved] || 0) + (toInt(totalViolations) || 0) };
      }, {},
    );

    const labels = Object.keys(violationToCount);
    const displayLabels = labels.map((label) => humanReadableTitleCase(label));
    const dataPoints = labels.map((violation) => violationToCount[violation]);
    setChartLabels(displayLabels);
    setChartDataPoints(dataPoints);
  }

  useEffect(() => {
    processResponse();
  }, [props.data]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Revocations',
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
              labelString: 'Violation type',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '# of revocations',
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
        Revocations by violation type
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by violation type"
        />
      </h4>

      {chart}
    </div>
  );
};

export default RevocationsByViolation;
