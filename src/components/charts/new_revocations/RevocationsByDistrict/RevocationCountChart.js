import React from "react";
import { Bar } from "react-chartjs-2";

import PropTypes from "prop-types";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { standardTooltipForCountMetric } from "../../../../utils/charts/toggles";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const RevocationCountChart = ({ chartId, data }) => (
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
              labelString: "District",
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
          },
        ],
      },
      tooltips: {
        backgroundColor: COLORS["grey-800-light"],
        footerFontSize: 9,
        mode: "index",
        intersect: false,
        callbacks: {
          label: standardTooltipForCountMetric,
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
        backgroundColor: PropTypes.func,
        data: PropTypes.arrayOf(PropTypes.number),
      })
    ),
  }).isRequired,
};

export default RevocationCountChart;
