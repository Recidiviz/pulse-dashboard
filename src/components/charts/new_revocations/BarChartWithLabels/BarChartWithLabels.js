import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import { tooltipForFooterWithNestedCounts } from "../../../../utils/charts/significantStatistics";
import { tooltipForRateMetricWithNestedCounts } from "../../../../utils/charts/toggles";
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
      legend: {
        position: "bottom",
        labels: {
          generateLabels: (ch) =>
            generateLabelsWithCustomColors(ch, labelColors),
        },
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
          label: (tooltipItem, data) =>
            tooltipForRateMetricWithNestedCounts(
              tooltipItem,
              data,
              numerators,
              denominators
            ),
          footer: (tooltipItem) =>
            tooltipForFooterWithNestedCounts(tooltipItem, denominators),
        },
      },
    }}
  />
);

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
  labelColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  numerators: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  denominators: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
};
export default BarChartWithLabels;
