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

import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import values from "lodash/fp/values";

import { toInteger } from "lodash";
import {
  COLORS,
  COLORS_GOOD_BAD,
} from "../../../assets/scripts/constants/colors";
import { configureDownloadButtons } from "../../../assets/scripts/utils/downloads";
import {
  toggleLabel,
  getMonthCountFromMetricPeriodMonthsToggle,
  updateTooltipForMetricType,
  filterDatasetByDistrict,
} from "../../../utils/charts/toggles";
import { sortFilterAndSupplementMostRecentMonths } from "../../../utils/transforms/datasets";
import { monthNamesWithYearsFromNumbers } from "../../../utils/transforms/months";

const dataCountsMapper = (dataset) => ({
  year: dataset[0].year,
  month: dataset[0].month,
  value: sumBy((data) => toInteger(data.population_change), dataset),
});

// For rates, the value is the delta value over the size of the population at the end of
// the previous month. If the population in question was 0, then we set the value to
// either positive 100% (if the delta is positive) or a negative 100% (if the delta is
// negative) or 0% (if there was no change at all).
const getRate = (delta, monthEndPopulation) => {
  if (monthEndPopulation !== 0) {
    return (100 * (delta / monthEndPopulation)).toFixed(2);
  }
  if (delta < 0) return -100.0;
  if (delta === 0) return 0.0;
  return 100.0;
};

const dataRatesMapper = (dataset) => {
  const delta = sumBy((data) => toInteger(data.population_change), dataset);
  const monthEndPopulation = sumBy(
    (data) => toInteger(data.month_end_population),
    dataset
  );

  return {
    year: dataset[0].year,
    month: dataset[0].month,
    value: getRate(delta, monthEndPopulation),
  };
};

const chartId = "admissionsVsReleases";

const AdmissionsVsReleases = ({
  admissionsVsReleases,
  district,
  metricType,
  metricPeriodMonths,
  header,
}) => {
  const dataPoints = pipe(
    (dataset) => filterDatasetByDistrict(dataset, district),
    groupBy(({ year, month }) => `${year}-${month}`),
    values,
    map(metricType === "counts" ? dataCountsMapper : dataRatesMapper),
    (dataset) =>
      sortFilterAndSupplementMostRecentMonths(
        dataset,
        getMonthCountFromMetricPeriodMonthsToggle(metricPeriodMonths),
        "value",
        0
      )
  )(admissionsVsReleases);

  const chartLabels = monthNamesWithYearsFromNumbers(
    map("month", dataPoints),
    true
  );
  const chartDataPoints = map("value", dataPoints);
  const chartColors = map(
    (data) => (data.value > 0 ? [COLORS_GOOD_BAD.bad] : [COLORS_GOOD_BAD.good]),
    dataPoints
  );

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: "Change in facility size",
            backgroundColor: chartColors,
            hoverBackgroundColor: chartColors,
            fill: false,
            data: chartDataPoints,
          },
        ],
      }}
      options={{
        legend: {
          display: false,
          position: "right",
          labels: {
            usePointStyle: true,
            boxWidth: 20,
          },
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "x",
          callbacks: {
            label: (tooltipItem, data) =>
              updateTooltipForMetricType(metricType, tooltipItem, data),
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
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  {
                    counts: "Admissions versus releases",
                    rates: "% change in facility size",
                  },
                  metricType
                ),
              },
            },
          ],
        },
      }}
    />
  );

  const exportedStructureCallback = () => ({
    metric: "Admissions versus releases",
    series: [],
  });

  configureDownloadButtons(
    chartId,
    "ADMISSIONS VERSUS RELEASES",
    chart.props.data.datasets,
    chart.props.data.labels,
    document.getElementById(chartId),
    exportedStructureCallback,
    { district, metricType, metricPeriodMonths },
    true,
    true
  );

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];

  const headerElement = document.getElementById(header);

  if (
    headerElement &&
    mostRecentValue !== null &&
    metricType === "counts" &&
    district[0].toUpperCase() === "ALL"
  ) {
    let title = "";
    if (mostRecentValue === 0) {
      title =
        "The ND facilities <span class='fs-block header-highlight'> have not changed in size</span> this month.";
    } else {
      const direction = mostRecentValue > 0 ? "grew" : "shrank";
      const absMostRecentValue = Math.abs(mostRecentValue);
      title = `The ND facilities <span class='fs-block header-highlight'>${direction} by ${absMostRecentValue} people</span> this month.`;
    }

    headerElement.innerHTML = title;
  } else if (headerElement) {
    headerElement.innerHTML = "";
  }

  return chart;
};

AdmissionsVsReleases.defaultProps = {
  admissionsVsReleases: [],
  hedaer: undefined,
};

AdmissionsVsReleases.propTypes = {
  admissionsVsReleases: PropTypes.arrayOf(PropTypes.shape({})),
  metricType: PropTypes.string.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  header: PropTypes.string,
};

export default AdmissionsVsReleases;
