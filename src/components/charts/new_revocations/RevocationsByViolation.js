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

import concat from "lodash/fp/concat";
import map from "lodash/fp/map";
import mergeAllWith from "lodash/fp/mergeAllWith";
import pick from "lodash/fp/pick";
import pipe from "lodash/fp/pipe";
import toInteger from "lodash/fp/toInteger";

import Loading from "../../Loading";
import Error from "../../Error";

import { COLORS } from "../../../assets/scripts/constants/colors";
import useChartData from "../../../hooks/useChartData";
import { axisCallbackForPercentage } from "../../../utils/charts/axis";
import { tooltipForRateMetricWithCounts } from "../../../utils/charts/toggles";
import { calculateRate } from "./helpers/rate";
import { filtersPropTypes } from "../propTypes";
import RevocationsByDimension from "./RevocationsByDimension";

const chartId = "revocationsByViolationType";
const violationCountKey = "violation_count";

const RevocationsByViolation = ({
  dataFilter,
  filterStates,
  stateCode,
  timeDescription,
  violationTypes,
  skippedFilters = [],
  treatCategoryAllAsAbsent = false,
}) => {
  const { isLoading, isError, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_violation"
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

  const allViolationTypeKeys = map("key", violationTypes);
  const chartLabels = map("label", violationTypes);

  const violationToCount = pipe(
    map(pick(concat(allViolationTypeKeys, violationCountKey))),
    mergeAllWith((a, b) => toInteger(a) + toInteger(b))
  )(filteredData);

  const totalViolationCount = toInteger(violationToCount[violationCountKey]);
  const numeratorCounts = map(
    (type) => violationToCount[type],
    allViolationTypeKeys
  );
  const denominatorCounts = map(
    () => totalViolationCount,
    allViolationTypeKeys
  );
  const chartDataPoints = map(
    (type) =>
      calculateRate(violationToCount[type], totalViolationCount).toFixed(2),
    allViolationTypeKeys
  );

  // This sets bar color to light-blue-500 when it's a technical violation, orange when it's law
  const colorTechnicalAndLaw = () =>
    violationTypes.map((violationType) => {
      switch (violationType.type) {
        case "TECHNICAL":
          return COLORS["lantern-light-blue"];
        case "LAW":
          return COLORS["lantern-orange"];
        default:
          return COLORS["lantern-light-blue"];
      }
    });

  const datasets = [
    {
      label: "Proportion of violations",
      backgroundColor: colorTechnicalAndLaw(),
      hoverBackgroundColor: colorTechnicalAndLaw(),
      hoverBorderColor: colorTechnicalAndLaw(),
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
                labelString: "Violation type and condition violated",
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Percent of total reported violations",
              },
              stacked: true,
              ticks: {
                min: 0,
                callback: axisCallbackForPercentage(),
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
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
          },
        },
      }}
    />
  );

  return (
    <RevocationsByDimension
      chartTitle="Relative frequency of violation types"
      timeDescription={timeDescription}
      labels={chartLabels}
      chartId={chartId}
      datasets={datasets}
      metricTitle="Relative frequency of violation types"
      filterStates={filterStates}
      chart={chart}
    />
  );
};

RevocationsByViolation.defaultProps = {
  skippedFilters: [],
  treatCategoryAllAsAbsent: false,
};

RevocationsByViolation.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  stateCode: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  violationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool,
};

export default RevocationsByViolation;
