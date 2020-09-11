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
import {
  stateCensusMapper,
  groupByRaceAndMap,
  addMissedRaceCounts,
  countMapper,
} from "../common/utils/races";
import { metricTypePropType } from "../propTypes";
import { METRIC_TYPES } from "../../constants";

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

const chartId = "revocationsByRace";

const RevocationProportionByRace = ({
  metricType,
  metricPeriodMonths,
  district,
  supervisionType,
  revocationProportionByRace,
  statePopulationByRace,
}) => {
  const counts = ["revocation_count", "total_supervision_count"];
  const stateCensusDataPoints = pipe(
    map(stateCensusMapper),
    sortBy("race")
  )(statePopulationByRace);

  const revocationProportion = pipe(
    (dataset) => filterDatasetBySupervisionType(dataset, supervisionType),
    (dataset) => filterDatasetByDistrict(dataset, district),
    (dataset) => filterDatasetByMetricPeriodMonths(dataset, metricPeriodMonths),
    groupByRaceAndMap(counts),
    addMissedRaceCounts(counts, stateCensusDataPoints),
    sortBy("race")
  )(revocationProportionByRace);

  const revocationDataPoints = map(
    countMapper("revocation_count"),
    revocationProportion
  );
  const supervisionDataPoints = map(
    countMapper("total_supervision_count"),
    revocationProportion
  );

  const totalRevocationsCount = sumBy("revocation_count", revocationProportion);
  const totalSupervisionPopulationCount = sumBy(
    "total_supervision_count",
    revocationProportion
  );

  const chartLabels = map("race", revocationDataPoints);
  const statePopulationProportions = map("proportion", stateCensusDataPoints);

  const revocationProportions = map(
    calculatePercents(totalRevocationsCount),
    revocationDataPoints
  );
  const revocationCounts = map("value", revocationDataPoints);

  const stateSupervisionProportions = map(
    calculatePercents(totalSupervisionPopulationCount),
    supervisionDataPoints
  );
  const stateSupervisionCounts = map("value", supervisionDataPoints);

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
  if (metricType === METRIC_TYPES.RATES) {
    activeChart = ratesChart;
  }

  useEffect(() => {
    configureDownloadButtons(
      chartId,
      "REVOCATIONS BY RACE",
      activeChart.props.data.datasets,
      activeChart.props.data.labels,
      document.getElementById("revocationsByRace"),
      exportedStructureCallback,
      { metricPeriodMonths, district, supervisionType }
    );
  }, [
    metricType,
    metricPeriodMonths,
    district,
    supervisionType,
    activeChart.props.data.datasets,
    activeChart.props.data.labels,
  ]);

  return activeChart;
};

RevocationProportionByRace.propTypes = {
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  supervisionType: PropTypes.string.isRequired,
  revocationProportionByRace: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      metric_period_months: PropTypes.string,
      race_or_ethnicity: PropTypes.string,
      revocation_count: PropTypes.string,
      state_code: PropTypes.string,
      supervision_type: PropTypes.string,
      total_supervision_count: PropTypes.string,
    })
  ).isRequired,
  statePopulationByRace: PropTypes.arrayOf(
    PropTypes.shape({
      proportion: PropTypes.string,
      race_or_ethnicity: PropTypes.string,
      state_code: PropTypes.string,
    })
  ).isRequired,
};

export default RevocationProportionByRace;
