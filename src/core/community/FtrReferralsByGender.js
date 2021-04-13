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
import { Bar } from "react-chartjs-2";

import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import range from "lodash/fp/range";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import {
  COLORS_STACKED_TWO_VALUES,
  COLORS,
} from "../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../utils/configureDownloadButtons";
import {
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
  filterDatasetByMetricPeriodMonths,
  filterDatasetByLabels,
} from "../utils/dataFilters";
import { tooltipForCountChart, tooltipForRateChart } from "../utils/tooltips";
import {
  genderValueToHumanReadable,
  genderValueToLabel,
} from "../../utils/formatStrings";
import { metricTypePropType } from "../utils/propTypes";
import { METRIC_TYPES } from "../utils/constants";

const chartId = "ftrReferralsByGender";

const FtrReferralsByGender = ({
  ftrReferralsByGender,
  supervisionType,
  district,
  metricPeriodMonths,
  metricType,
  getTokenSilently,
}) => {
  const filteredFtrReferrals = pipe(
    (dataset) =>
      filterDatasetByLabels(dataset, "gender", Object.keys(genderValueToLabel)),
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    (dataset) => filterDatasetByMetricPeriodMonths(dataset, metricPeriodMonths),
    groupBy("gender"),
    values,
    map((dataset) => ({
      gender: genderValueToHumanReadable(dataset[0].gender),
      referralCount: sumBy(({ count }) => toInteger(count), dataset),
      supervisionPopulation: sumBy(
        ({ total_supervision_count: count }) => toInteger(count),
        dataset
      ),
    })),
    sortBy("gender")
  )(ftrReferralsByGender);

  const totalFtrReferrals = sumBy("referralCount", filteredFtrReferrals);
  const totalSupervisionPopulation = sumBy(
    "supervisionPopulation",
    filteredFtrReferrals
  );

  const chartLabels = map("gender", filteredFtrReferrals);

  const ftrReferralProportions = map(
    (data) => 100 * (data.referralCount / totalFtrReferrals),
    filteredFtrReferrals
  );

  const ftrReferralCounts = map("referralCount", filteredFtrReferrals);
  const stateSupervisionProportions = map(
    (data) => 100 * (data.supervisionPopulation / totalSupervisionPopulation),
    filteredFtrReferrals
  );
  const stateSupervisionCounts = map(
    "supervisionPopulation",
    filteredFtrReferrals
  );

  const countsChart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: "Referrals",
            backgroundColor: COLORS_STACKED_TWO_VALUES[0],
            hoverBackgroundColor: COLORS_STACKED_TWO_VALUES[0],
            yAxisID: "y-axis-left",
            data: ftrReferralCounts,
          },
          {
            label: "Supervision Population",
            backgroundColor: COLORS_STACKED_TWO_VALUES[1],
            hoverBackgroundColor: COLORS_STACKED_TWO_VALUES[1],
            yAxisID: "y-axis-left",
            data: stateSupervisionCounts,
          },
        ],
      }}
      options={{
        plugins: {
          datalabels: {
            display: false,
          },
        },
        responsive: true,
        legend: {
          display: true,
          position: "bottom",
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "index",
          callbacks: tooltipForCountChart(
            ftrReferralCounts,
            "Referral",
            stateSupervisionCounts,
            "Supervision"
          ),
        },
        scaleShowValues: true,
        scales: {
          yAxes: [
            {
              stacked: false,
              ticks: {
                beginAtZero: true,
                min: undefined,
                max: undefined,
              },
              position: "left",
              id: "y-axis-left",
              scaleLabel: {
                display: true,
                labelString: "Count",
              },
            },
          ],
          xAxes: [
            {
              stacked: false,
              ticks: {
                autoSkip: false,
              },
              scaleLabel: {
                display: true,
                labelString: "Gender",
              },
            },
          ],
        },
      }}
    />
  );

  const ratesChart = (
    <Bar
      id={chartId}
      data={{
        labels: ["Referrals", "Supervision Population"],
        datasets: map(
          (i) => ({
            label: chartLabels[i],
            backgroundColor: COLORS_STACKED_TWO_VALUES[i],
            hoverBackgroundColor: COLORS_STACKED_TWO_VALUES[i],
            hoverBorderColor: COLORS_STACKED_TWO_VALUES[i],
            data: [ftrReferralProportions[i], stateSupervisionProportions[i]],
          }),
          range(0, 2)
        ),
      }}
      options={{
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Percentage",
              },
              stacked: true,
              ticks: {
                min: 0,
                max: 100,
              },
            },
          ],
        },
        responsive: true,
        legend: {
          position: "bottom",
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "dataset",
          intersect: true,
          callbacks: tooltipForRateChart(),
        },
      }}
    />
  );

  let activeChart = countsChart;
  if (metricType === METRIC_TYPES.RATES) {
    activeChart = ratesChart;
  }

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "FTR REFERRALS BY GENDER",
      chartDatasets: activeChart.props.data.datasets,
      chartLabels: activeChart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: { supervisionType, district, metricPeriodMonths, metricType },
      dataExportLabel: "Gender",
      getTokenSilently,
    });
  }, [
    supervisionType,
    district,
    metricPeriodMonths,
    metricType,
    activeChart.props.data.datasets,
    activeChart.props.data.labels,
    getTokenSilently,
  ]);

  return activeChart;
};

FtrReferralsByGender.propTypes = {
  ftrReferralsByGender: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.string,
      district: PropTypes.string,
      gender: PropTypes.string,
      metric_period_months: PropTypes.string,
      state_code: PropTypes.string,
      supervision_type: PropTypes.string,
      total_supervision_count: PropTypes.string,
    })
  ).isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  metricType: metricTypePropType.isRequired,
};

export default FtrReferralsByGender;
