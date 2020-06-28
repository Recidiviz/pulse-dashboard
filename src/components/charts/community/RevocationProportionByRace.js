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
import { Bar, HorizontalBar } from "react-chartjs-2";

import concat from "lodash/fp/concat";
import difference from "lodash/fp/difference";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import range from "lodash/fp/range";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

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
import { raceValueToHumanReadable } from "../../../utils/transforms/labels";

const colors = [
  COLORS_FIVE_VALUES[0],
  COLORS_FIVE_VALUES[1],
  COLORS_FIVE_VALUES[2],
  COLORS_FIVE_VALUES[3],
  COLORS_FIVE_VALUES[4],
  COLORS["blue-standard-2"],
  COLORS["blue-standard"],
];

/**
 * Groups and brings to mind:
 * { race: 'Asian', totalSupervisionCount: 43, revocationCount: 123 }
 */
const groupByRaceAndMap = pipe(
  groupBy("race_or_ethnicity"),
  values,
  map((dataset) => ({
    race: raceValueToHumanReadable(dataset[0].race_or_ethnicity),
    totalSupervisionCount: sumBy(
      (data) => toInteger(data.total_supervision_count),
      dataset
    ),
    revocationCount: sumBy((data) => toInteger(data.revocation_count), dataset),
  }))
);

const addMissedRaceCounts = (stateCensusDataPoints) => (dataset) =>
  pipe(
    map("race"),
    difference(map("race", stateCensusDataPoints)),
    map((race) => ({ race, totalSupervisionCount: 0, revocationCount: 0 })),
    concat(dataset)
  )(dataset);

const revocationMapper = ({ race, revocationCount }) => ({
  race,
  count: revocationCount,
});

const supervisionMapper = ({ race, totalSupervisionCount }) => ({
  race,
  count: totalSupervisionCount,
});

const stateCensusMapper = ({ race_or_ethnicity: race, proportion }) => ({
  race: raceValueToHumanReadable(race),
  proportion: Number(proportion),
});

const calculatePercents = (total) => ({ count }) => 100 * (count / total);

const chartId = "revocationsByRace";

const RevocationProportionByRace = ({
  metricType,
  metricPeriodMonths,
  district,
  supervisionType,
  revocationProportionByRace,
  statePopulationByRace,
}) => {
  const stateCensusDataPoints = pipe(
    map(stateCensusMapper),
    sortBy("race")
  )(statePopulationByRace);

  const revocationProportion = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    (dataset) => filterDatasetByMetricPeriodMonths(dataset, metricPeriodMonths),
    groupByRaceAndMap,
    addMissedRaceCounts(stateCensusDataPoints),
    sortBy("race")
  )(revocationProportionByRace);

  const revocationDataPoints = map(revocationMapper, revocationProportion);
  const supervisionDataPoints = map(supervisionMapper, revocationProportion);

  const totalRevocationsCount = sumBy("revocationCount", revocationProportion);
  const totalSupervisionPopulationCount = sumBy(
    "totalSupervisionCount",
    revocationProportion
  );

  const chartLabels = map("race", revocationDataPoints);
  const statePopulationProportions = map("proportion", stateCensusDataPoints);

  const revocationProportions = map(
    calculatePercents(totalRevocationsCount),
    revocationDataPoints
  );
  const revocationCounts = map("count", revocationDataPoints);

  const stateSupervisionProportions = map(
    calculatePercents(totalSupervisionPopulationCount),
    supervisionDataPoints
  );
  const stateSupervisionCounts = map("count", supervisionDataPoints);

  const ratesChart = (
    <HorizontalBar
      id={chartId}
      data={{
        labels: ["Revocations", "Supervision Population", "ND Population"],
        datasets: map(
          (i) => ({
            label: chartLabels[i],
            backgroundColor: colors[i],
            hoverBackgroundColor: colors[i],
            hoverBorderColor: colors[i],
            data: [
              revocationProportions[i],
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
              if (data.labels[tooltipItem.index] === "Revocations") {
                datasetCounts = revocationCounts;
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

  const countsChart = (
    <Bar
      id={chartId}
      data={{
        labels: ["Revocation Counts", "Supervision Population"],
        datasets: map(
          (i) => ({
            label: chartLabels[i],
            backgroundColor: colors[i],
            hoverBackgroundColor: colors[i],
            hoverBorderColor: colors[i],
            data: [revocationCounts[i], stateSupervisionCounts[i]],
          }),
          range(0, chartLabels.length)
        ),
      }}
      options={{
        responsive: true,
        legend: {
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: false,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Revocation counts",
              },
            },
          ],
        },
      }}
    />
  );

  const exportedStructureCallback = () => ({
    metric: "Revocations by race",
    series: [],
  });

  let activeChart = countsChart;
  if (metricType === "rates") {
    activeChart = ratesChart;
  }

  configureDownloadButtons(
    chartId,
    "REVOCATIONS BY RACE",
    activeChart.props.data.datasets,
    activeChart.props.data.labels,
    document.getElementById("revocationsByRace"),
    exportedStructureCallback,
    { metricPeriodMonths, district, supervisionType }
  );

  return activeChart;
};

RevocationProportionByRace.defaultProps = {
  revocationProportionByRace: [],
  statePopulationByRace: [],
};

RevocationProportionByRace.propTypes = {
  metricType: PropTypes.string.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  supervisionType: PropTypes.string.isRequired,
  revocationProportionByRace: PropTypes.arrayOf(PropTypes.shape({})),
  statePopulationByRace: PropTypes.arrayOf(PropTypes.shape({})),
};

export default RevocationProportionByRace;
