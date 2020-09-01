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

import ExportMenu from "../ExportMenu";
import Loading from "../../Loading";

import { COLORS } from "../../../assets/scripts/constants/colors";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../hooks/useChartData";
import { axisCallbackForPercentage } from "../../../utils/charts/axis";
import { tooltipForRateMetricWithCounts } from "../../../utils/charts/toggles";
import { calculateRate } from "./helpers/rate";

const chartId = "revocationsByViolationType";
const violationCountKey = "violation_count";

const RevocationsByViolation = ({
  dataFilter,
  filterStates,
  skippedFilters,
  treatCategoryAllAsAbsent,
  stateCode,
  timeDescription,
  violationTypes,
}) => {
  const { isLoading, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_violation"
  );

  if (isLoading) {
    return <Loading />;
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

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: "Proportion of violations",
            backgroundColor: colorTechnicalAndLaw(),
            hoverBackgroundColor: colorTechnicalAndLaw(),
            hoverBorderColor: colorTechnicalAndLaw(),
            data: chartDataPoints,
          },
        ],
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
    <div>
      <h4>
        Relative frequency of violation types
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Relative frequency of violation types"
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>

      <div className="static-chart-container fs-block">{chart}</div>
    </div>
  );
};

RevocationsByViolation.defaultProps = {
  skippedFilters: [],
  treatCategoryAllAsAbsent: undefined,
};

const metricPeriodMonthsType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

RevocationsByViolation.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: PropTypes.shape({
    admissionType: PropTypes.arrayOf(PropTypes.string),
    metricPeriodMonths: metricPeriodMonthsType.isRequired,
    chargeCategory: PropTypes.string,
    district: PropTypes.arrayOf(PropTypes.string),
    supervisionType: PropTypes.string,
  }).isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool,
  stateCode: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  violationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RevocationsByViolation;
