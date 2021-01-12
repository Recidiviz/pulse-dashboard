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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../utils/downloads/downloads";
import {
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
} from "../../../utils/charts/dataFilters";
import {
  getGoalForChart,
  getMaxForGoalAndDataIfGoalDisplayable,
  chartAnnotationForGoal,
} from "../../../utils/charts/metricGoal";
import {
  toggleLabel,
  getMonthCountFromMetricPeriodMonthsToggle,
  updateTooltipForMetricType,
  canDisplayGoal,
  toggleYAxisTicksFor,
  centerSingleMonthDatasetIfNecessary,
} from "../../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../../utils/transforms/months";
import { groupByMonth } from "../common/bars/utils";
import { metricTypePropType, officeDataPropTypes } from "../propTypes";
import { METRIC_TYPES } from "../../constants";

const dataCountsMapper = ({ year, month, revocation_count: count }) => ({
  year,
  month,
  value: count,
});

const dataRatesMapper = ({
  year,
  month,
  revocation_count: count,
  total_supervision_count: totalCount,
}) => ({
  year,
  month,
  value: ((100 * count) / totalCount).toFixed(2),
});

const chartId = "revocationCountsByMonth";
const stepSize = 10;

const RevocationCountOverTime = ({
  revocationCountsByMonth: countsByMonth,
  supervisionType,
  district,
  metricType,
  metricPeriodMonths,
  disableGoal = false,
  header,
  stateCode,
}) => {
  const goal = getGoalForChart(stateCode, chartId);

  const chartDataPoints = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    groupByMonth(["revocation_count", "total_supervision_count"]),
    map(metricType === METRIC_TYPES.RATES ? dataRatesMapper : dataCountsMapper),
    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(
        dataset,
        getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths),
        "value",
        0
      )
  )(countsByMonth);

  const chartDataValues = chartDataPoints.map((element) => element.value);
  const chartLabels = monthNamesWithYearsFromNumbers(
    map("month", chartDataPoints),
    true
  );

  const chartMinValue = 0;
  const chartMaxValue = getMaxForGoalAndDataIfGoalDisplayable(
    goal,
    chartDataValues,
    stepSize,
    { disableGoal, metricType, supervisionType, district }
  );

  centerSingleMonthDatasetIfNecessary(chartDataValues, chartLabels);

  const displayGoal = canDisplayGoal(goal, {
    disableGoal,
    metricType,
    supervisionType,
    district,
  });

  function goalLineIfApplicable() {
    if (displayGoal) {
      return chartAnnotationForGoal(
        goal,
        "revocationCountsByMonthGoalLine",
        {}
      );
    }
    return null;
  }

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: toggleLabel(
              { counts: "Revocation count", rates: "Revocation rate" },
              metricType
            ),
            backgroundColor: COLORS["grey-500"],
            borderColor: COLORS["grey-500"],
            pointBackgroundColor: COLORS["grey-500"],
            pointHoverBackgroundColor: COLORS["grey-500"],
            pointHoverBorderColor: COLORS["grey-500"],
            fill: false,
            borderWidth: 2,
            data: chartDataValues,
          },
        ],
      }}
      options={{
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: toggleYAxisTicksFor(
                METRIC_TYPES.COUNTS,
                metricType,
                chartMinValue,
                chartMaxValue,
                stepSize
              ),
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { counts: "Revocation count", rates: "Percentage" },
                  metricType
                ),
              },
              stacked: true,
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "x",
          callbacks: {
            label: (tooltipItem, data) =>
              updateTooltipForMetricType(metricType, tooltipItem, data),
          },
        },
        annotation: goalLineIfApplicable(),
      }}
    />
  );

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "REVOCATION ADMISSIONS BY MONTH",
      chartDatasets: chart.props.data.datasets,
      chartLabels: chart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: { metricType, supervisionType, district },
      convertValuesToNumbers: true,
      handleTimeStringLabels: true,
    });
  }, [
    metricType,
    district,
    supervisionType,
    chart.props.data.datasets,
    chart.props.data.labels,
  ]);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  useEffect(() => {
    const headerElement = document.getElementById(header);

    if (headerElement && mostRecentValue !== null && displayGoal) {
      const title = `There have been <span class='fs-block header-highlight'>${mostRecentValue} revocations</span> that led to incarceration in a DOCR facility this month so far.`;
      headerElement.innerHTML = title;
    } else if (headerElement) {
      headerElement.innerHTML = "";
    }
  }, [displayGoal, header, mostRecentValue]);

  return chart;
};

RevocationCountOverTime.defaultProps = {
  disableGoal: false,
};

RevocationCountOverTime.propTypes = {
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  metricType: metricTypePropType.isRequired,
  stateCode: PropTypes.string.isRequired,
  supervisionType: PropTypes.string.isRequired,
  officeData: PropTypes.arrayOf(officeDataPropTypes).isRequired,
  revocationCountsByMonth: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string.isRequired,
      month: PropTypes.string.isRequired,
      revocation_count: PropTypes.string.isRequired,
      state_code: PropTypes.string.isRequired,
      supervision_type: PropTypes.string.isRequired,
      total_supervision_count: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    })
  ).isRequired,
  disableGoal: PropTypes.bool,
};

export default RevocationCountOverTime;
