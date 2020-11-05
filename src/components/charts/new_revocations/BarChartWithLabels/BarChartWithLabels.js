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
import {
  tooltipForFooterWithCounts,
  tooltipForFooterWithNestedCounts,
} from "../../../../utils/charts/significantStatistics";
import {
  tooltipForRateMetricWithCounts,
  tooltipForRateMetricWithNestedCounts,
} from "../../../../utils/charts/toggles";
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
  isNested,
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
            (isNested
              ? tooltipForRateMetricWithNestedCounts
              : tooltipForRateMetricWithCounts)(
              tooltipItem,
              tooltipData,
              numerators,
              denominators
            ),
          footer: (tooltipItem) =>
            (isNested
              ? tooltipForFooterWithNestedCounts
              : tooltipForFooterWithCounts)(tooltipItem, denominators),
        },
      },
    }}
  />
);

BarChartWithLabels.defaultProps = {
  labelColors: [],
  isNested: false,
};

BarChartWithLabels.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        backgroundColor: PropTypes.func,
        data: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  numerators: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  denominators: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
  isNested: PropTypes.bool,
  labelColors: PropTypes.arrayOf(PropTypes.string),
};
export default BarChartWithLabels;
