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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import mapValues from "lodash/fp/mapValues";
import meanBy from "lodash/fp/meanBy";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";

import { filterDatasetByDistrict } from "../../../utils/charts/toggles";
import { METRIC_TYPES } from "../../constants";
import { metricTypePropType } from "../propTypes";

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
    case "0-12":
      return "<12";
    case "120+":
      return "120<";
    default:
      return oldStayLength;
  }
};

const ratesTooltipLabel = ({ datasetIndex, index }, { datasets }) => {
  const dataset = datasets[datasetIndex];
  const rate = (dataset.data[index] * 100).toFixed(2);
  return `${dataset.label}: ${rate}%`;
};

const countsTooltipLabel = ({ datasetIndex, index }, { datasets }) => {
  const dataset = datasets[datasetIndex];
  return `${dataset.label}: ${dataset.data[index]}`;
};

const ReincarcerationRateByStayLength = ({
  district,
  metricType,
  ratesByStayLength,
}) => {
  const label =
    metricType === METRIC_TYPES.COUNTS
      ? "Number reincarcerated"
      : "Reincarceration rate";

  const dataPointsMap = pipe(
    (dataset) => filterDatasetByDistrict(dataset, district),
    groupBy("stay_length_bucket"),
    mapValues((dataset) => ({
      count: sumBy("reincarceration_count", dataset),
      rate: meanBy("recidivism_rate", dataset),
    }))
  )(ratesByStayLength);

  const dataPoints = map((chartLabel) => {
    const transformedLabel = transformStayLength(chartLabel);

    const dataPointsForLabel = dataPointsMap[transformedLabel];
    if (dataPointsForLabel === undefined) {
      return 0;
    }

    return metricType === METRIC_TYPES.COUNTS
      ? dataPointsForLabel.count
      : dataPointsForLabel.rate;
  })(chartLabels);

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
            data: dataPoints,
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
            label:
              metricType === METRIC_TYPES.COUNTS
                ? countsTooltipLabel
                : ratesTooltipLabel,
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

  useEffect(() => {
    configureDownloadButtons(
      chartId,
      "REINCARCERATIONS BY PREVIOUS STAY LENGTH",
      chart.props.data.datasets,
      chart.props.data.labels,
      document.getElementById(chartId),
      exportedStructureCallback,
      { district, metricType }
    );
  }, [
    chart.props.data.datasets,
    chart.props.data.labels,
    district,
    metricType,
  ]);

  return chart;
};

ReincarcerationRateByStayLength.propTypes = {
  ratesByStayLength: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      follow_up_period: PropTypes.string,
      recidivism_rate: PropTypes.string,
      reincarceration_count: PropTypes.string,
      release_cohort: PropTypes.string,
      state_code: PropTypes.string,
      stay_length_bucket: PropTypes.string,
    })
  ).isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricType: metricTypePropType.isRequired,
};

export default ReincarcerationRateByStayLength;
