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

import React from "react";
import { Bar } from "react-chartjs-2";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";

import { filterDatasetByDistrict } from "../../../utils/charts/toggles";

const chartId = "reincarcerationRateByStayLength";
const chartLabels = [
  "0-12",
  "12-24",
  "24-36",
  "36-48",
  "48-60",
  "60-72",
  "72-84",
  "84-96",
  "96-108",
  "108-120",
  "120+",
];

const transformStayLength = (oldStayLength) => {
  switch (oldStayLength) {
    case "<12":
      return "0-12";
    case "120<":
      return "120+";
    default:
      return oldStayLength;
  }
};

const computeRateDataPoints = (filteredRatesByStayLength) => {
  const ratesByStayLengthData = {};
  filteredRatesByStayLength.forEach(
    ({ stay_length_bucket: stayLength, recidivism_rate: rate }) => {
      ratesByStayLengthData[transformStayLength(stayLength)] = rate;
    }
  );
  return chartLabels.map((chartLabel) => ratesByStayLengthData[chartLabel]);
};

const computeCountDataPoints = (filteredRatesByStayLength) => {
  const ratesByStayLengthData = {};
  filteredRatesByStayLength.forEach(
    ({ stay_length_bucket: stayLength, reincarceration_count: count }) => {
      ratesByStayLengthData[transformStayLength(stayLength)] = count;
    }
  );
  return chartLabels.map((chartLabel) => ratesByStayLengthData[chartLabel]);
};

const ReincarcerationRateByStayLength = ({
  district,
  metricType,
  ratesByStayLength,
}) => {
  const filteredReincarcerationsByStayLength = filterDatasetByDistrict(
    ratesByStayLength,
    district
  );

  const label =
    metricType === "counts" ? "Number reincarcerated" : "Reincarceration rate";

  const chartDataPoints =
    metricType === "counts"
      ? computeCountDataPoints(filteredReincarcerationsByStayLength)
      : computeRateDataPoints(filteredReincarcerationsByStayLength);

  const tooltipLabel = ({ datasetIndex, index }, { datasets }) => {
    const dataset = datasets[datasetIndex];
    if (metricType === "counts") {
      return `${dataset.label}: ${dataset.data[index]}`;
    }
    const rate = (dataset.data[index] * 100).toFixed(2);
    return `${dataset.label}: ${rate}%`;
  };

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label,
            backgroundColor: COLORS["blue-standard"],
            hoverBackgroundColor: COLORS["blue-standard"],
            yAxisID: "y-axis-left",
            data: chartDataPoints,
          },
        ],
      }}
      options={{
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "index",
          callbacks: {
            label: tooltipLabel,
          },
        },
        scaleShowValues: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              position: "left",
              id: "y-axis-left",
              scaleLabel: {
                display: true,
                labelString: label,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
              scaleLabel: {
                display: true,
                labelString: "Stay length (in months)",
              },
            },
          ],
        },
      }}
    />
  );

  const exportedStructureCallback = () => ({
    metric: "Reincarcerations by previous stay length",
    series: [],
  });

  configureDownloadButtons(
    chartId,
    "REINCARCERATIONS BY PREVIOUS STAY LENGTH",
    chart.props.data.datasets,
    chart.props.data.labels,
    document.getElementById(chartId),
    exportedStructureCallback,
    { district, metricType }
  );

  return chart;
};

export default ReincarcerationRateByStayLength;
