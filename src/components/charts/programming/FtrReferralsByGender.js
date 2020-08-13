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
  COLORS_STACKED_TWO_VALUES_ALT,
  COLORS,
} from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";
import {
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
  filterDatasetByMetricPeriodMonths,
} from "../../../utils/charts/toggles";
import {
  tooltipForCountChart,
  tooltipForRateChart,
} from "../../../utils/charts/tooltips";
import { genderValueToHumanReadable } from "../../../utils/transforms/labels";

const chartId = "ftrReferralsByGender";

const FtrReferralsByGender = ({
  ftrReferralsByGender,
  supervisionType,
  district,
  metricPeriodMonths,
  metricType,
}) => {
  const filteredFtrReferrals = pipe(
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
            backgroundColor: COLORS["blue-standard"],
            hoverBackgroundColor: COLORS["blue-standard"],
            yAxisID: "y-axis-left",
            data: ftrReferralCounts,
          },
          {
            label: "Supervision Population",
            backgroundColor: COLORS["blue-standard-2"],
            hoverBackgroundColor: COLORS["blue-standard-2"],
            yAxisID: "y-axis-left",
            data: stateSupervisionCounts,
          },
        ],
      }}
      options={{
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
            backgroundColor: COLORS_STACKED_TWO_VALUES_ALT[i],
            hoverBackgroundColor: COLORS_STACKED_TWO_VALUES_ALT[i],
            hoverBorderColor: COLORS_STACKED_TWO_VALUES_ALT[i],
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
  if (metricType === "rates") {
    activeChart = ratesChart;
  }

  const exportedStructureCallback = () => ({
    metric: "FTR Referrals by Gender",
    series: [],
  });

  useEffect(() => {
    configureDownloadButtons(
      chartId,
      "FTR REFERRALS BY GENDER",
      activeChart.props.data.datasets,
      activeChart.props.data.labels,
      document.getElementById(chartId),
      exportedStructureCallback,
      { supervisionType, district, metricPeriodMonths, metricType }
    );
  }, [
    supervisionType,
    district,
    metricPeriodMonths,
    metricType,
    activeChart.props.data.datasets,
    activeChart.props.data.labels,
  ]);

  return activeChart;
};

export default FtrReferralsByGender;
