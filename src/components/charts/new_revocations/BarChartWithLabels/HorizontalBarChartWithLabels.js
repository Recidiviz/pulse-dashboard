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
import { HorizontalBar } from "react-chartjs-2";
import cloneDeep from "lodash/fp/cloneDeep";
import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import { tooltipForFooterWithCounts } from "../../../../utils/charts/significantStatistics";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import "chartjs-plugin-datalabels";

const HorizontalBarChartWithLabels = ({
  activeTab,
  id,
  data,
  numerators,
  denominators,
}) => {
  const translateRaceLabels = translate("raceLabelMap");
  const filteredData = React.useMemo(() => {
    const cloneData = cloneDeep(data);
    cloneData.datasets = data?.datasets?.filter(
      ({ label }) => label === translateRaceLabels[activeTab]
    );
    return cloneData;
  }, [activeTab, data, translateRaceLabels]);

  return (
    <HorizontalBar
      id={id}
      data={filteredData}
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
              return `${Math.trunc(value)} %`;
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: false,
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
                beginAtZero: false,
                callback: axisCallbackForPercentage(),
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          footerFontSize: 9,
          mode: "dataset",
          intersect: true,
          position: "nearest",
          callbacks: {
            label: (tooltipItem, tooltipData) => {
              return tooltipForRateMetricWithCounts(
                id,
                tooltipItem,
                tooltipData,
                numerators,
                denominators
              );
            },
            footer: (tooltipItem) =>
              tooltipForFooterWithCounts(tooltipItem, denominators),
          },
        },
      }}
    />
  );
};

HorizontalBarChartWithLabels.propTypes = {
  id: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
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
};
export default HorizontalBarChartWithLabels;
