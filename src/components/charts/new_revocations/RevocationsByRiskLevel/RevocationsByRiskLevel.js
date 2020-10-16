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

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import pattern from "patternomaly";

import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sortBy from "lodash/fp/sortBy";
import values from "lodash/fp/values";

import { findDenominatorKeyByMode, getLabelByMode } from "./helpers";
import { sumIntBy } from "../helpers/counts";
import { calculateRate } from "../helpers/rate";
import ModeSwitcher from "../ModeSwitcher";
import Loading from "../../../Loading";
import Error from "../../../Error";

import flags from "../../../../flags";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import useChartData from "../../../../hooks/useChartData";
import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import {
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../../../../utils/charts/significantStatistics";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { humanReadableTitleCase } from "../../../../utils/transforms/labels";
import { filtersPropTypes } from "../../propTypes";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import RevocationsByDimension from "../RevocationsByDimension";

const chartId = "revocationsByRiskLevel";

const modeButtons = [
  { label: "Percent revoked of standing population", value: "rates" },
  { label: "Percent revoked of exits", value: "exits" },
];

const RevocationsByRiskLevel = ({
  stateCode,
  dataFilter,
  skippedFilters,
  treatCategoryAllAsAbsent,
  filterStates,
  timeDescription,
}) => {
  const [mode, setMode] = useState("rates"); // rates | exits

  const denominatorKey = findDenominatorKeyByMode(mode);
  const chartLabel = getLabelByMode(mode);

  const { isLoading, isError, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_risk_level"
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const filteredData = dataFilter(
    apiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );

  const riskLevels = translate("riskLevelsMap");

  const riskLevelCounts = pipe(
    filter((data) => Object.keys(riskLevels).includes(data.risk_level)),
    groupBy("risk_level"),
    values,
    sortBy((dataset) => Object.keys(riskLevels).indexOf(dataset[0].risk_level)),
    map((dataset) => {
      const riskLevelLabel = riskLevels[dataset[0].risk_level];
      const label = humanReadableTitleCase(riskLevelLabel);
      const numerator = sumIntBy("population_count", dataset);
      const denominator = sumIntBy(denominatorKey, dataset);
      const rate = calculateRate(numerator, denominator);
      return {
        label,
        numerator,
        denominator,
        rate: rate.toFixed(2),
      };
    })
  )(filteredData);

  const chartLabels = map("label", riskLevelCounts);
  const chartDataPoints = map("rate", riskLevelCounts);
  const numeratorCounts = map("numerator", riskLevelCounts);
  const denominatorCounts = map("denominator", riskLevelCounts);

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominatorCounts
  );

  const barBackgroundColor = ({ dataIndex }) => {
    const color = COLORS["lantern-orange"];
    if (isDenominatorStatisticallySignificant(denominatorCounts[dataIndex])) {
      return color;
    }
    return pattern.draw("diagonal-right-left", color, "#ffffff", 5);
  };
  const datasets = [
    {
      label: chartLabel,
      backgroundColor: barBackgroundColor,
      data: chartDataPoints,
    },
  ];

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets,
      }}
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
                labelString: chartLabel,
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
            label: (tooltipItem, data) =>
              tooltipForRateMetricWithCounts(
                tooltipItem,
                data,
                numeratorCounts,
                denominatorCounts
              ),
            footer: (tooltipItem) =>
              tooltipForFooterWithCounts(tooltipItem, denominatorCounts),
          },
        },
      }}
    />
  );

  return (
    <RevocationsByDimension
      chartTitle="Admissions by risk level"
      timeDescription={timeDescription}
      labels={chartLabels}
      chartId={chartId}
      datasets={datasets}
      metricTitle={`${chartLabel} by risk level`}
      filterStates={filterStates}
      chart={chart}
      showWarning={showWarning}
      modeSwitcher={
        flags.enableRevocationRateByExit ? (
          <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
        ) : null
      }
    />
  );
};

RevocationsByRiskLevel.defaultProps = {
  skippedFilters: [],
  treatCategoryAllAsAbsent: false,
};

RevocationsByRiskLevel.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRiskLevel;
