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
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import { tooltipForFooterWithCounts } from "../../../../utils/charts/significantStatistics";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { generateLabelsWithCustomColors } from "./helpers";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const BarChartWithLabels = ({
  id,
  data,
  labelColors,
  xAxisLabel,
  yAxisLabel,
  numerators,
  denominators,
}) => (
  <Bar
    id={id}
    data={data}
    options={{
      legend: labelColors.length
        ? {
            position: "bottom",
            labels: {
              generateLabels: (ch) =>
                generateLabelsWithCustomColors(ch, labelColors),
            },
          }
        : { display: false },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: xAxisLabel,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: axisCallbackForPercentage(),
            },
            scaleLabel: {
              display: true,
              labelString: yAxisLabel,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: COLORS["grey-800-light"],
        footerFontSize: 9,
        mode: "index",
        intersect: false,
        callbacks: {
          label: (tooltipItem, tooltipData) =>
            tooltipForRateMetricWithCounts(
              tooltipItem,
              tooltipData,
              numerators,
              denominators
            ),
          footer: (tooltipItem) =>
            tooltipForFooterWithCounts(tooltipItem, denominators),
        },
      },
    }}
  />
);

BarChartWithLabels.defaultProps = {
  labelColors: [],
};

BarChartWithLabels.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        backgroundColor: PropTypes.oneOfType([
          PropTypes.func,
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.string,
        ]),
        data: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  numerators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number])
  ).isRequired,
  denominators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number])
  ).isRequired,
  labelColors: PropTypes.arrayOf(PropTypes.string),
};
export default BarChartWithLabels;
