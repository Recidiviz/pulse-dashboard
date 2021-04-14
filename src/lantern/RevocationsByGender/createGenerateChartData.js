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

import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";

import { CHART_COLORS, CHART_COLORS_STACKED } from "./constants";
import { applyStatisticallySignificantShadingToDataset } from "../utils/significantStatistics";

import {
  getStatePopulations,
  getStatePopulationsLabels,
  genderValueToLabel,
} from "../../utils/formatStrings";
import getCounts from "../utils/getCounts";
import createPopulationMap from "../utils/createPopulationMap";

export const generateDatasets = (dataPoints, denominators, chartColors) => {
  return Object.values(genderValueToLabel).map((genderLabel, index) => ({
    label: genderLabel,
    backgroundColor: applyStatisticallySignificantShadingToDataset(
      chartColors[index],
      denominators
    ),
    data: dataPoints[index],
  }));
};

const createGenerateStackedChartData = ({
  filteredData,
  statePopulationData,
}) => {
  const genders = Object.keys(genderValueToLabel);
  const { dataPoints, numerators, denominators } = pipe(
    reduce(createPopulationMap("gender"), {}),
    (data) =>
      getCounts(
        data,
        getStatePopulations(),
        genders,
        statePopulationData,
        "gender"
      )
  )(filteredData);

  const datasets = generateDatasets(
    dataPoints,
    denominators,
    CHART_COLORS_STACKED
  );

  const data = {
    labels: getStatePopulationsLabels(),
    datasets,
  };

  return {
    data,
    numerators,
    denominators,
  };
};

const createGenerateChartDataByMode = (
  { filteredData, statePopulationData },
  mode
) => {
  const genders = Object.keys(genderValueToLabel);
  const { dataPoints, numerators, denominators } = pipe(
    reduce(createPopulationMap("gender"), {}),
    (data) =>
      getCounts(
        data,
        getStatePopulations(),
        genders,
        statePopulationData,
        "gender"
      )
  )(filteredData);

  const datasets = generateDatasets(dataPoints, denominators, CHART_COLORS);
  const datasetIndex = datasets.findIndex(
    (d) => d.label === genderValueToLabel[mode]
  );
  const data = {
    labels: getStatePopulationsLabels(),
    datasets: [datasets[datasetIndex]],
  };

  return {
    data,
    numerators: numerators[datasetIndex],
    denominators: denominators[datasetIndex],
  };
};

const createGenerateChartData = (chartData, stacked) => (mode) => {
  return stacked
    ? createGenerateStackedChartData(chartData)
    : createGenerateChartDataByMode(chartData, mode);
};

export default createGenerateChartData;
