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
import PropTypes from "prop-types";

import { translate } from "../utils/i18nSettings";
import { standardTooltipForCountMetricLabel } from "../utils/tooltips";
import { COLORS } from "../assets/scripts/constants/colors";

const RevocationCountChart = ({ chartId, data, xAxisLabel }) => (
  <Bar
    id={chartId}
    data={data}
    options={{
      plugins: {
        datalabels: {
          display: false,
        },
      },
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: xAxisLabel,
            },
            stacked: true,
          },
        ],
        yAxes: [
          {
            id: "y-axis-0",
            scaleLabel: {
              display: true,
              labelString: `Number of people ${translate("revoked")}`,
            },
            stacked: true,
            ticks: {
              precision: 0,
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
          label: standardTooltipForCountMetricLabel,
        },
      },
    }}
  />
);

RevocationCountChart.propTypes = {
  chartId: PropTypes.string.isRequired,
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
        data: PropTypes.arrayOf(PropTypes.number),
      })
    ),
  }).isRequired,
  xAxisLabel: PropTypes.string.isRequired,
};

export default RevocationCountChart;
