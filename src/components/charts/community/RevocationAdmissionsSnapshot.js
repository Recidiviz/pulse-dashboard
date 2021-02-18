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

import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

import flatten from "lodash/fp/flatten";
import keys from "lodash/fp/keys";
import identity from "lodash/fp/identity";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";
import sortBy from "lodash/fp/sortBy";
import toInteger from "lodash/fp/toInteger";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../utils/downloads/downloads";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../../utils/transforms/months";
import {
  filterDatasetByDistrict,
  filterDatasetBySupervisionType,
} from "../../../utils/charts/dataFilters";
import {
  getGoalForChart,
  getMinForGoalAndData,
  getMaxForGoalAndData,
  trendlineGoalText,
  chartAnnotationForGoal,
} from "../../../utils/charts/metricGoal";
import {
  getMonthCountFromMetricPeriodMonthsToggle,
  updateTooltipForMetricType,
  toggleLabel,
  canDisplayGoal,
  toggleYAxisTicksBasedOnGoal,
  centerSingleMonthDatasetIfNecessary,
} from "../../../utils/charts/toggles";
import { generateTrendlineDataset } from "../../../utils/charts/trendline";
import { metricTypePropType } from "../propTypes";
import { METRIC_TYPES } from "../../constants";

const chartId = "revocationAdmissionsSnapshot";
const stepSize = 10;

const calculateTotalAdmissions = (data) =>
  toInteger(data.new_admissions) +
  toInteger(data.technicals) +
  toInteger(data.non_technicals) +
  toInteger(data.unknown_revocations);

const calculateTotalRevocations = (data) =>
  toInteger(data.technicals) +
  toInteger(data.non_technicals) +
  toInteger(data.unknown_revocations);

const calculatePercentRevocations = (totalAdmissionsByYearAndMonth, data) => {
  const totalAdmissions = totalAdmissionsByYearAndMonth[data.year][data.month];
  return totalAdmissions
    ? (100 * (data.value / totalAdmissions)).toFixed(2)
    : 0.0;
};

const toRevocationCountsList = (dataMap) =>
  pipe(
    keys,
    sortBy(identity),
    map((year) =>
      pipe(
        keys,
        sortBy(Number),
        map((month) => ({
          year,
          month,
          value: dataMap[year][month],
        }))
      )(dataMap[year])
    ),
    flatten
  )(dataMap);

const groupByMonth = (totalCalculator) =>
  reduce((acc, data) => {
    const { year, month } = data;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = 0;
    acc[year][month] += totalCalculator(data);
    return acc;
  }, {});

const RevocationAdmissionsSnapshot = ({
  stateCode,
  disableGoal,
  header,
  revocationAdmissionsByMonth: countsByMonth,
  supervisionType,
  district,
  metricType,
  metricPeriodMonths,
}) => {
  const toggles = useMemo(() => {
    return {
      supervisionType,
      district,
      metricType,
      metricPeriodMonths,
      disableGoal,
    };
  }, [supervisionType, district, metricType, metricPeriodMonths, disableGoal]);
  const goal = getGoalForChart(stateCode, chartId);
  const displayGoal = canDisplayGoal(goal, toggles);
  const months = getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths);

  /**
   * For this chart specifically, we want the denominator for rates to be the total admission
   * count in a given month across all supervision types and districts, while the numerator
   * remains scoped to the selected supervision type and/or district, if selected.
   */
  const totalPrisonAdmissions = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, "ALL"),
    (dataset) => filterDatasetByDistrict(dataset, ["ALL"]),
    groupByMonth(calculateTotalAdmissions)
  )(countsByMonth);

  // Proceed with normal data filtering and processing
  const dataPoints = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    groupByMonth(calculateTotalRevocations),
    toRevocationCountsList,
    metricType === METRIC_TYPES.COUNTS
      ? identity
      : map((data) => ({
          ...data,
          value: calculatePercentRevocations(totalPrisonAdmissions, data),
        })),

    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(dataset, months, "value", "0")
  )(countsByMonth);

  const chartDataValues = map("value", dataPoints);
  const min = getMinForGoalAndData(goal.value, chartDataValues, stepSize);
  const max = getMaxForGoalAndData(goal.value, chartDataValues, stepSize);
  const monthNames = monthNamesWithYearsFromNumbers(
    map("month", dataPoints),
    true
  );

  centerSingleMonthDatasetIfNecessary(chartDataValues, monthNames);

  const chartDataPoints = chartDataValues;
  const chartLabels = monthNames;
  const chartMinValue = min;
  const chartMaxValue = max;

  function goalLineIfApplicable() {
    if (displayGoal) {
      return chartAnnotationForGoal(
        goal,
        "revocationAdmissionsSnapshotGoalLine",
        { yAdjust: 10 }
      );
    }
    return null;
  }

  function datasetsWithTrendlineIfApplicable() {
    const datasets = [
      {
        label: toggleLabel(
          {
            counts: "Revocation admissions",
            rates: "Percentage from revocations",
          },
          metricType
        ),
        backgroundColor: COLORS["blue-standard"],
        borderColor: COLORS["blue-standard"],
        pointBackgroundColor: COLORS["blue-standard"],
        pointHoverBackgroundColor: COLORS["blue-standard"],
        pointHoverBorderColor: COLORS["blue-standard"],
        pointRadius: 4,
        hitRadius: 5,
        fill: false,
        borderWidth: 2,
        lineTension: 0,
        data: chartDataPoints,
      },
    ];
    if (displayGoal) {
      datasets.push(
        generateTrendlineDataset(chartDataPoints, COLORS["blue-standard-light"])
      );
    }
    return datasets;
  }

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: datasetsWithTrendlineIfApplicable(),
      }}
      options={{
        plugins: {
          datalabels: {
            display: false,
          },
        },
        legend: {
          display: false,
          position: "right",
          labels: {
            usePointStyle: true,
            boxWidth: 5,
          },
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          enabled: true,
          mode: "point",
          callbacks: {
            label: (tooltipItem, data) =>
              updateTooltipForMetricType(metricType, tooltipItem, data),
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: COLORS["grey-600"],
                autoSkip: true,
              },
              scaleLabel: {
                display: true,
                labelString: "Month",
                fontColor: COLORS["grey-500"],
                fontStyle: "bold",
              },
              gridLines: {
                color: "#FFF",
              },
            },
          ],
          yAxes: [
            {
              ticks: toggleYAxisTicksBasedOnGoal(
                displayGoal,
                chartMinValue,
                chartMaxValue,
                stepSize,
                { fontColor: COLORS["grey-600"] }
              ),
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { counts: "Revocation admissions", rates: "% of admissions" },
                  metricType
                ),
                fontColor: COLORS["grey-500"],
                fontStyle: "bold",
              },
              gridLines: {
                color: COLORS["grey-300"],
              },
            },
          ],
        },
        annotation: goalLineIfApplicable(),
      }}
    />
  );

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "PRISON ADMISSIONS DUE TO REVOCATION",
      chartDatasets: chart.props.data.datasets,
      chartLabels: chart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: toggles,
      convertValuesToNumbers: true,
      handleTimeStringLabels: true,
    });
  }, [
    metricType,
    metricPeriodMonths,
    district,
    supervisionType,
    chart.props.data.datasets,
    chart.props.data.labels,
    toggles,
  ]);

  useEffect(() => {
    const headerElement = document.getElementById(header);

    if (headerElement && displayGoal) {
      const trendlineValues = chart.props.data.datasets[1].data;
      const trendlineText = trendlineGoalText(trendlineValues, goal);

      const title = `The percent of prison admissions due to revocations of probation and parole has been <span class='fs-block header-highlight'>trending ${trendlineText}.</span>`;
      headerElement.innerHTML = title;
    } else if (headerElement) {
      headerElement.innerHTML = "";
    }
  }, [chart.props.data.datasets, displayGoal, goal, header]);

  return chart;
};

RevocationAdmissionsSnapshot.defaultProps = {
  disableGoal: false,
};

RevocationAdmissionsSnapshot.propTypes = {
  stateCode: PropTypes.string.isRequired,
  disableGoal: PropTypes.bool,
  header: PropTypes.string,
  revocationAdmissionsByMonth: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      month: PropTypes.string,
      new_admissions: PropTypes.string,
      non_technicals: PropTypes.string,
      state_code: PropTypes.string,
      supervision_type: PropTypes.string,
      technicals: PropTypes.string,
      unknown_revocations: PropTypes.string,
      year: PropTypes.string,
    })
  ).isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
};

export default RevocationAdmissionsSnapshot;
