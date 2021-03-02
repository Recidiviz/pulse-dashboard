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
import toInteger from "lodash/fp/toInteger";

import { groupByMonth } from "../bars/utils";

import { COLORS } from "../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../utils/downloads/downloads";
import {
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
} from "../../utils/charts/dataFilters";
import {
  toggleLabel,
  getMonthCountFromMetricPeriodMonthsToggle,
  updateTooltipForMetricType,
  centerSingleMonthDatasetIfNecessary,
} from "../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../utils/transforms/months";
import { metricTypePropType } from "../utils/propTypes";
import { METRIC_TYPES } from "../utils/constants";

const dataCountsMapper = ({ year, month, count }) => ({
  year,
  month,
  value: toInteger(count),
});

const dataRatesMapper = ({
  year,
  month,
  count: referralCount,
  total_supervision_count: supervisionCount,
}) => {
  const value = 100 * (toInteger(referralCount) / toInteger(supervisionCount));

  return {
    year,
    month,
    value: value.toFixed(2),
  };
};

const sortAndSupplementMostRecentMonths = (metricPeriodMonths) => (dataset) =>
  sortFilterAndSupplementMostRecentMonths(
    dataset,
    getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths),
    "value",
    0
  );

const chartId = "ftrReferralCountByMonth";

const FtrReferralCountByMonth = ({
  ftrReferralCountByMonth: countsByMonth,
  supervisionType,
  district,
  metricType,
  metricPeriodMonths,
  header = null,
}) => {
  const dataPoints = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    groupByMonth(["count", "total_supervision_count"]),
    map(metricType === METRIC_TYPES.RATES ? dataRatesMapper : dataCountsMapper),
    sortAndSupplementMostRecentMonths(metricPeriodMonths)
  )(countsByMonth);

  const chartDataValues = map("value", dataPoints);
  const monthNames = monthNamesWithYearsFromNumbers(
    map("month", dataPoints),
    true
  );

  centerSingleMonthDatasetIfNecessary(chartDataValues, monthNames);

  const chartLabels = monthNames;
  const chartDataPoints = chartDataValues;

  const chart = (
    <Line
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: toggleLabel(
              { counts: "Referral count", rates: "Referral rate" },
              metricType
            ),
            backgroundColor: COLORS["grey-500"],
            borderColor: COLORS["grey-500"],
            pointBackgroundColor: COLORS["grey-500"],
            pointHoverBackgroundColor: COLORS["grey-500"],
            pointHoverBorderColor: COLORS["grey-500"],
            fill: false,
            borderWidth: 2,
            data: chartDataPoints,
          },
        ],
      }}
      options={{
        plugins: {
          datalabels: {
            display: false,
          },
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
              },
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { counts: "Referral count", rates: "Referral rate" },
                  metricType
                ),
              },
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
      }}
    />
  );

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "FTR REFERRAL COUNT BY MONTH",
      chartDatasets: chart.props.data.datasets,
      chartLabels: chart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: { supervisionType, district, metricType, metricPeriodMonths },
      convertValuesToNumbers: true,
      handleTimeStringLabels: true,
    });
  }, [
    supervisionType,
    district,
    metricPeriodMonths,
    metricType,
    chart.props.data.datasets,
    chart.props.data.labels,
  ]);

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  useEffect(() => {
    const headerElement = header && document.getElementById(header);

    if (
      headerElement &&
      mostRecentValue !== null &&
      metricType === METRIC_TYPES.COUNTS
    ) {
      const title = `There have been <span class='fs-block header-highlight'>${mostRecentValue} referrals</span> to Free Through Recovery this month so far.`;
      headerElement.innerHTML = title;
    } else if (headerElement) {
      headerElement.innerHTML = "";
    }
  }, [header, metricType, mostRecentValue]);

  return chart;
};

FtrReferralCountByMonth.defaultProps = {
  header: null,
};

FtrReferralCountByMonth.propTypes = {
  ftrReferralCountByMonth: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.string,
      district: PropTypes.string,
      month: PropTypes.string,
      state_code: PropTypes.string,
      supervision_type: PropTypes.string,
      total_supervision_count: PropTypes.string,
      year: PropTypes.string,
    })
  ).isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  header: PropTypes.string,
};

export default FtrReferralCountByMonth;
