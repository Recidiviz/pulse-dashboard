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

import { CHART_COLORS } from "./constants";
import { applyStatisticallySignificantShadingToDataset } from "../../../../utils/charts/significantStatistics";

import {
  getStatePopulations,
  getStatePopulationsLabels,
  genderValueToLabel,
} from "../../../../utils/transforms/labels";
import getCounts from "../utils/getCounts";
import createRacePopulationMap from "../utils/createRacePopulationMap";

export const generateDatasets = (dataPoints, denominators) => {
  return Object.values(genderValueToLabel).map((genderLabel, index) => ({
    label: genderLabel,
    backgroundColor: applyStatisticallySignificantShadingToDataset(
      CHART_COLORS[index],
      denominators
    ),
    data: dataPoints[index],
  }));
};

const createGenerateChartData = ({
  filteredData,
  statePopulationData,
}) => () => {
  const numeratorKey = [
    "revocation_count",
    "supervision_population_count",
    "population_count",
  ];
  const denominatorKey = [
    "revocation_count_all",
    "supervision_count_all",
    "total_state_population_count",
  ];
  const genders = Object.keys(genderValueToLabel);
  const { dataPoints, numerators, denominators } = pipe(
    reduce(createRacePopulationMap(numeratorKey, denominatorKey, "gender"), {}),
    (data) =>
      getCounts(
        data,
        getStatePopulations(),
        genders,
        statePopulationData,
        "gender"
      )
  )(filteredData);
  const data = {
    labels: getStatePopulationsLabels(),
    datasets: generateDatasets(dataPoints, denominators),
  };
  return { data, numerators, denominators };
};

export default createGenerateChartData;
