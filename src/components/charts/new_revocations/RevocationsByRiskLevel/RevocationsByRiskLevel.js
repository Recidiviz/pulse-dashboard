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

import ModeSwitcher from "../ModeSwitcher";
import Loading from "../../../Loading";
import Error from "../../../Error";
import RevocationsByDimension from "../RevocationsByDimension";

import flags from "../../../../flags";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import useChartData from "../../../../hooks/useChartData";
import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import {
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../../../../utils/charts/significantStatistics";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { filtersPropTypes } from "../../propTypes";
import getLabelByMode from "../utils/getLabelByMode";
import generateRevocationsByRiskLevelChartData from "./generateRevocationsByRiskLevelChartData";

const chartId = "revocationsByRiskLevel";

const RevocationsByRiskLevel = ({
  stateCode,
  dataFilter,
  filterStates,
  timeDescription,
}) => {
  const [mode, setMode] = useState("rates"); // rates | exits

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

  const {
    data: chartData,
    numerators,
    denominators,
  } = generateRevocationsByRiskLevelChartData(apiData, dataFilter, mode);

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const modeButtons = [
    { label: getLabelByMode("rates"), value: "rates" },
    { label: getLabelByMode("exits"), value: "exits" },
  ];

  const chart = (
    <Bar
      id={chartId}
      data={chartData}
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
                labelString: chartData.labels,
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
    <RevocationsByDimension
      chartTitle="Admissions by risk level"
      timeDescription={timeDescription}
      labels={chartData.labels}
      chartId={chartId}
      datasets={chartData.datasets}
      metricTitle={`${getLabelByMode(mode)} by risk level`}
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

RevocationsByRiskLevel.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRiskLevel;
