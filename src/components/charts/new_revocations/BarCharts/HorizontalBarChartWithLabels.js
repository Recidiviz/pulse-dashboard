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
import "chartjs-plugin-datalabels";

import React from "react";
import PropTypes from "prop-types";
import { HorizontalBar } from "react-chartjs-2";

import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const HorizontalBarChartWithLabels = ({
  id,
  data,
  numerators,
  denominators,
}) => {
  return (
    <HorizontalBar
      id={id}
      data={data}
      options={{
        legend: { display: false },
        plugins: {
          datalabels: {
            clamp: true,
            align: "end",
            anchor: "end",
            offset: 16,
            color: "#2B2B2A",
            font: {
              size: 20,
              weight: 500,
            },
            formatter(value) {
              return value < 1
                ? `${parseFloat(value).toFixed(1)}%`
                : `${Math.trunc(value)}%`;
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 110,
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontSize: 14,
                fontStyle: "normal",
                fontColor: "#4F4E4D",
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "dataset",
          intersect: true,
          position: "nearest",
          displayColors: false,
          callbacks: {
            title: () => {},
            label: (tooltipItem, tooltipData) => {
              return tooltipForRateMetricWithCounts(
                id,
                tooltipItem,
                tooltipData,
                numerators,
                denominators
              );
            },
          },
        },
      }}
    />
  );
};

HorizontalBarChartWithLabels.propTypes = {
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
  numerators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number])
  ).isRequired,
  denominators: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number])
  ).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  labelsMap: PropTypes.object.isRequired,
};

export default React.memo(HorizontalBarChartWithLabels);