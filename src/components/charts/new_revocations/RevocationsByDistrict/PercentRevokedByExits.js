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
import pattern from "patternomaly";

import map from "lodash/fp/map";
import orderBy from "lodash/fp/orderBy";
import pipe from "lodash/fp/pipe";

import ModeSwitcher from "../ModeSwitcher";
import DataSignificanceWarningIcon from "../../DataSignificanceWarningIcon";
import ExportMenu from "../../ExportMenu";
import {
  groupByDistrictCreator,
  mergeRevocationData,
  sumCounts,
  modeButtons,
} from "./helpers";
import { calculateRate, getRateAnnotation } from "../helpers/rate";
import {
  isDenominatorsMatrixStatisticallySignificant,
  isDenominatorStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../../../../utils/charts/significantStatistics";

import { COLORS } from "../../../../assets/scripts/constants/colors";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { axisCallbackForPercentage } from "../../../../utils/charts/axis";

const PercentRevokedByExits = ({
  chartId,
  chartTitle,
  setMode,
  filterStates,
  timeDescription,
  currentDistrict,
  revocationApiData,
  supervisionApiData,
}) => {
  const agregatedData = pipe(mergeRevocationData, orderBy(["rate"], ["desc"]))(
    groupByDistrictCreator("population_count", revocationApiData),
    groupByDistrictCreator("total_exit_count", supervisionApiData)
  );

  const labels = map("district", agregatedData);
  const dataPoints = map((item) => item.rate.toFixed(2), agregatedData);
  const numerators = map("count", agregatedData);
  const denominators = map("total", agregatedData);

  const averageRate = calculateRate(
    sumCounts("population_count", revocationApiData),
    sumCounts("total_exit_count", supervisionApiData)
  );

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const barBackgroundColor = ({ dataIndex }) => {
    let color =
      currentDistrict &&
      currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
        ? COLORS["lantern-light-blue"]
        : COLORS["lantern-orange"];
    if (!isDenominatorStatisticallySignificant(denominators[dataIndex])) {
      color = pattern.draw("diagonal-right-left", color, "#ffffff", 5);
    }
    return color;
  };

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels,
        datasets: [
          {
            label: "Percent revoked out of all exits",
            backgroundColor: barBackgroundColor,
            data: dataPoints,
          },
        ],
      }}
      options={{
        annotation: getRateAnnotation(averageRate),
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
                labelString: "Percent revoked out of all exits",
              },
              stacked: true,
              ticks: {
                callback: axisCallbackForPercentage(),
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
              tooltipForRateMetricWithCounts(
                tooltipItem,
                data,
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

  return (
    <div>
      <h4>
        {chartTitle}
        {showWarning && <DataSignificanceWarningIcon />}
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle={chartTitle}
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>
      <ModeSwitcher mode="exits" setMode={setMode} buttons={modeButtons} />
      <div className="static-chart-container fs-block">{chart}</div>
    </div>
  );
};

PercentRevokedByExits.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartTitle: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  filterStates: PropTypes.shape({}).isRequired,
  timeDescription: PropTypes.string.isRequired,
  currentDistrict: PropTypes.string.isRequired,
  revocationApiData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  supervisionApiData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PercentRevokedByExits;
