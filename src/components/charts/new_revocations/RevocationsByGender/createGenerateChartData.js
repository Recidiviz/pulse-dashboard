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

import getOr from "lodash/fp/getOr";
import pipe from "lodash/fp/pipe";
import set from "lodash/fp/set";
import toInteger from "lodash/fp/toInteger";
import reduce from "lodash/fp/reduce";

import { CHART_COLORS } from "./constants";
import { getBarBackgroundColor } from "../../../../utils/charts/significantStatistics";
import {
  getRiskLevels,
  getRiskLevelLabels,
} from "../../../../utils/transforms/labels";
import getDenominatorKeyByMode from "../utils/getDenominatorKeyByMode";
import getCounts from "../utils/getCounts";

/**
 * These are the only genders that are apparent in the source data set,
 * not all of the genders we would like to represent.
 */
const GENDERS = ["FEMALE", "MALE"];

/**
 * Transform to
 * {
 *   FEMALE: { LOW: [1, 4], HIGH: [5, 9], ... } }
 *   MALE: { LOW: [2, 9], HIGH: [2, 8], ... } }
 * }
 */
const dataTransformer = (numeratorKey, denominatorKey) => (acc, data) =>
  pipe(
    set(
      [data.gender, data.risk_level],
      [
        getOr(0, [data.gender, data.risk_level, 0], acc) +
          toInteger(data[numeratorKey]),
        getOr(0, [data.gender, data.risk_level, 1], acc) +
          toInteger(data[denominatorKey]),
      ]
    ),
    set(
      [data.gender, "OVERALL"],
      [
        getOr(0, [data.gender, "OVERALL", 0], acc) +
          toInteger(data[numeratorKey]),
        getOr(0, [data.gender, "OVERALL", 1], acc) +
          toInteger(data[denominatorKey]),
      ]
    )
  )(acc);

const createGenerateChartData = (dataFilter, stateCode) => (apiData, mode) => {
  const numeratorKey = "population_count";
  const denominatorKey = getDenominatorKeyByMode(mode);

  const { dataPoints, numerators, denominators } = pipe(
    dataFilter,
    reduce(dataTransformer(numeratorKey, denominatorKey), {}),
    (data) => getCounts(data, getRiskLevels(stateCode), GENDERS)
  )(apiData);

  const generateDataset = (label, index) => ({
    label,
    backgroundColor: getBarBackgroundColor(CHART_COLORS[index], denominators),
    data: dataPoints[index],
  });

  const data = {
    labels: getRiskLevelLabels(stateCode),
    datasets: ["Women", "Men"].map(generateDataset),
  };

  return { data, numerators, denominators };
};

export default createGenerateChartData;
