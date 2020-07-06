// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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
import { Bar, HorizontalBar } from "react-chartjs-2";

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import range from "lodash/fp/range";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";

import {
  COLORS_FIVE_VALUES,
  COLORS,
} from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";
import {
  filterDatasetBySupervisionType,
  filterDatasetByDistrict,
  filterDatasetByMetricPeriodMonths,
} from "../../../utils/charts/toggles";
import { tooltipForCountChart } from "../../../utils/charts/tooltips";
import {
  addMissedRaceCounts,
  countMapper,
  groupByRaceAndMap,
  stateCensusMapper,
} from "../common/utils/races";

const chartId = "ftrReferralsByRace";
const colors = [
  COLORS_FIVE_VALUES[0],
  COLORS_FIVE_VALUES[1],
  COLORS_FIVE_VALUES[2],
  COLORS_FIVE_VALUES[3],
  COLORS_FIVE_VALUES[4],
  COLORS["blue-standard-2"],
  COLORS["blue-standard"],
];

const calculatePercents = (total) => ({ value }) => 100 * (value / total);

const FtrReferralsByRace = ({
  ftrReferralsByRace,
  statePopulationByRace,
  supervisionType,
  district,
  metricPeriodMonths,
  metricType,
}) => {
  const counts = ["count", "total_supervision_count"];
  const stateCensusDataPoints = pipe(
    map(stateCensusMapper),
    sortBy("race")
  )(statePopulationByRace);

  const filteredFtrReferrals = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    (dataset) => filterDatasetByMetricPeriodMonths(dataset, metricPeriodMonths),
    groupByRaceAndMap(counts),
    addMissedRaceCounts(counts, stateCensusDataPoints),
    sortBy("race")
  )(ftrReferralsByRace);

  const chartLabels = map("race", filteredFtrReferrals);
  const statePopulationProportions = map("proportion", stateCensusDataPoints);

  // ftr refereal
  const ftrReferralDataPoints = map(countMapper("count"), filteredFtrReferrals);
  const totalFtrReferrals = sumBy("count", filteredFtrReferrals);
  const ftrReferralCounts = map("value", ftrReferralDataPoints);
  const ftrReferralProportions = map(
    calculatePercents(totalFtrReferrals),
    ftrReferralDataPoints
  );

  // supervision
  const supervisionDataPoints = map(
    countMapper("total_supervision_count"),
    filteredFtrReferrals
  );
  const totalSupervisionPopulation = sumBy(
    "total_supervision_count",
    filteredFtrReferrals
  );
  const stateSupervisionCounts = map("value", supervisionDataPoints);
  const stateSupervisionProportions = map(
    calculatePercents(totalSupervisionPopulation),
    supervisionDataPoints
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
                callback(value) {
                  if (value.length > 12) {
                    return `${value.substr(0, 12)}...`; // Truncate
                  }
                  return value;
                },
              },
              scaleLabel: {
                display: true,
                labelString: "Race and Ethnicity",
              },
            },
          ],
        },
      }}
    />
  );

  const ratesChart = (
    <HorizontalBar
      id={chartId}
      data={{
        labels: ["Referrals", "Supervision Population", "ND Population"],
        datasets: map(
          (i) => ({
            label: chartLabels[i],
            backgroundColor: colors[i],
            hoverBackgroundColor: colors[i],
            hoverBorderColor: colors[i],
            data: [
              ftrReferralProportions[i],
              stateSupervisionProportions[i],
              statePopulationProportions[i],
            ],
          }),
          range(0, chartLabels.length)
        ),
      }}
      options={{
        scales: {
          xAxes: [
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
          yAxes: [
            {
              stacked: true,
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
          callbacks: {
            title: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem[0].datasetIndex];
              return dataset.label;
            },
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const currentValue = dataset.data[tooltipItem.index];

              let datasetCounts = [];
              if (data.labels[tooltipItem.index] === "Referrals") {
                datasetCounts = ftrReferralCounts;
              } else if (
                data.labels[tooltipItem.index] === "Supervision Population"
              ) {
                datasetCounts = stateSupervisionCounts;
              } else {
                return "".concat(
                  currentValue.toFixed(2),
                  "% of ",
                  data.labels[tooltipItem.index]
                );
              }

              return "".concat(
                currentValue.toFixed(2),
                "% of ",
                data.labels[tooltipItem.index],
                " (",
                datasetCounts[tooltipItem.datasetIndex],
                ")"
              );
            },
          },
        },
      }}
    />
  );

  let activeChart = countsChart;
  if (metricType === "rates") {
    activeChart = ratesChart;
  }

  const exportedStructureCallback = () => ({
    metric: "FTR Referrals by Race",
    series: [],
  });

  configureDownloadButtons(
    chartId,
    "FTR REFERRALS BY RACE",
    activeChart.props.data.datasets,
    activeChart.props.data.labels,
    document.getElementById(chartId),
    exportedStructureCallback,
    { supervisionType, district, metricPeriodMonths, metricType }
  );

  return activeChart;
};

export default FtrReferralsByRace;
