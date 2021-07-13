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

import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import range from "lodash/fp/range";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Bar, HorizontalBar } from "react-chartjs-2";

import {
  COLORS,
  COLORS_SEVEN_VALUES,
  COLORS_STACKED_TWO_VALUES,
} from "../../assets/scripts/constants/colors";
import { raceValueToLabel } from "../../utils/formatStrings";
import { configureDownloadButtons } from "../utils/configureDownloadButtons";
import { METRIC_TYPES } from "../utils/constants";
import {
  filterDatasetByDistrict,
  filterDatasetByLabels,
  filterDatasetByMetricPeriodMonths,
  filterDatasetBySupervisionType,
} from "../utils/dataFilters";
import { metricTypePropType } from "../utils/propTypes";
import {
  addMissedRaceCounts,
  countMapper,
  groupByRaceAndMap,
  stateCensusMapper,
} from "../utils/races";
import { tooltipForCountChart } from "../utils/tooltips";

const chartId = "ftrReferralsByRace";

const calculatePercents = (total) => ({ value }) => 100 * (value / total);

const FtrReferralsByRace = ({
  ftrReferralsByRace,
  statePopulationByRace,
  supervisionType,
  district,
  metricPeriodMonths,
  metricType,
  getTokenSilently,
}) => {
  const counts = ["count", "total_supervision_count"];
  const stateCensusDataPoints = pipe(
    map(stateCensusMapper),
    sortBy("race")
  )(statePopulationByRace);

  const filteredFtrReferrals = pipe(
    (dataset) =>
      filterDatasetByLabels(
        dataset,
        "race_or_ethnicity",
        Object.keys(raceValueToLabel)
      ),
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
                  if (value && value.length > 12) {
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
            backgroundColor: COLORS_SEVEN_VALUES[i],
            hoverBackgroundColor: COLORS_SEVEN_VALUES[i],
            hoverBorderColor: COLORS_SEVEN_VALUES[i],
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
        plugins: {
          datalabels: {
            display: false,
          },
        },
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
  if (metricType === METRIC_TYPES.RATES) {
    activeChart = ratesChart;
  }

  useEffect(() => {
    configureDownloadButtons({
      chartId,
      chartTitle: "FTR REFERRALS BY RACE",
      chartDatasets: activeChart.props.data.datasets,
      chartLabels: activeChart.props.data.labels,
      chartBox: document.getElementById(chartId),
      filters: { supervisionType, district, metricPeriodMonths, metricType },
      dataExportLabel: "Race",
      getTokenSilently,
    });
  }, [
    getTokenSilently,
    supervisionType,
    district,
    metricPeriodMonths,
    metricType,
    activeChart.props.data.datasets,
    activeChart.props.data.labels,
  ]);

  return activeChart;
};

FtrReferralsByRace.propTypes = {
  ftrReferralsByRace: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.string,
      district: PropTypes.string,
      metric_period_months: PropTypes.string,
      race_or_ethnicity: PropTypes.string,
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
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
};

export default FtrReferralsByRace;
