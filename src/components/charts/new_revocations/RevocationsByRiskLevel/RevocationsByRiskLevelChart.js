import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { tooltipForFooterWithCounts } from "../../../../utils/charts/significantStatistics";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const RevocationsByRiskLevelChart = ({
  chartId,
  data,
  denominators,
  numerators,
}) => (
  <Bar
    id={chartId}
    data={data}
    options={{
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
              labelString: "Risk level",
            },
            stacked: true,
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
              labelString: data.labels,
            },
            stacked: true,
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

RevocationsByRiskLevelChart.propTypes = {
  chartId: PropTypes.string.isRequired,
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
  numerators: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  denominators: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
};

export default RevocationsByRiskLevelChart;
