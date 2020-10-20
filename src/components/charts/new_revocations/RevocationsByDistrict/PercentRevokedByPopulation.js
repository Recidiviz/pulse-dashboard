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
import pattern from "patternomaly";

import groupBy from "lodash/fp/groupBy";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";
import orderBy from "lodash/fp/orderBy";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import ModeSwitcher from "../ModeSwitcher";

import { sumCounts, modeButtons } from "./helpers";
import { calculateRate, getRateAnnotation } from "../helpers/rate";
import {
  isDenominatorsMatrixStatisticallySignificant,
  isDenominatorStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../../../../utils/charts/significantStatistics";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { tooltipForRateMetricWithCounts } from "../../../../utils/charts/toggles";
import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import { filtersPropTypes } from "../../propTypes";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import RevocationsByDimension from "../RevocationsByDimension/RevocationsByDimensionComponent";

const PercentRevokedByPopulation = ({
  chartId,
  chartTitle,
  setMode,
  filterStates,
  timeDescription,
  currentDistricts,
  revocationApiData,
}) => {
  const filteredData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("district"),
    values,
    map((dataset) => ({
      district: dataset[0].district,
      count: sumBy((item) => toInteger(item.population_count), dataset),
      supervision_count: sumBy(
        (item) => toInteger(item.total_supervision_count),
        dataset
      ),
    })),
    map((dataPoint) => ({
      district: dataPoint.district,
      count: dataPoint.count,
      supervision_count: dataPoint.supervision_count,
      rate: calculateRate(dataPoint.count, dataPoint.supervision_count),
    })),
    orderBy(["rate"], ["desc"])
  )(revocationApiData);

  const labels = map("district", filteredData);
  const dataPoints = map((item) => item.rate.toFixed(2), filteredData);
  const numerators = map("count", filteredData);
  const denominators = map("supervision_count", filteredData);

  const averageRate = calculateRate(
    sumCounts("population_count", revocationApiData),
    sumCounts("total_supervision_count", revocationApiData)
  );

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const barBackgroundColor = ({ dataIndex }) => {
    let color =
      currentDistricts &&
      currentDistricts.find(
        (currentDistrict) =>
          currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
      )
        ? COLORS["lantern-light-blue"]
        : COLORS["lantern-orange"];
    if (!isDenominatorStatisticallySignificant(denominators[dataIndex])) {
      color = pattern.draw("diagonal-right-left", color, "#ffffff", 5);
    }
    return color;
  };

  const datasets = [
    {
      label: translate("percentOfPopulationRevoked"),
      backgroundColor: barBackgroundColor,
      data: dataPoints,
    },
  ];

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels,
        datasets,
      }}
      options={{
        annotation: getRateAnnotation(averageRate),
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "District",
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              id: "y-axis-0",
              scaleLabel: {
                display: true,
                labelString: translate("percentOfPopulationRevoked"),
              },
              stacked: true,
              ticks: {
                callback: axisCallbackForPercentage(),
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          footerFontSize: 9,
          mode: "index",
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) =>
              tooltipForRateMetricWithCounts(
                tooltipItem,
                data,
                numerators,
                denominators
              ),
            footer: (tooltipItem) =>
              tooltipForFooterWithCounts(tooltipItem, denominators),
          },
        },
      }}
    />
  );

  return (
    <RevocationsByDimension
      chartTitle={chartTitle}
      timeDescription={timeDescription}
      labels={labels}
      chartId={chartId}
      datasets={datasets}
      metricTitle={chartTitle}
      filterStates={filterStates}
      chart={chart}
      modeSwitcher={
        <ModeSwitcher mode="rates" setMode={setMode} buttons={modeButtons()} />
      }
      showWarning={showWarning}
    />
  );
};

PercentRevokedByPopulation.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartTitle: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
  currentDistricts: PropTypes.arrayOf(PropTypes.string).isRequired,
  revocationApiData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default PercentRevokedByPopulation;
