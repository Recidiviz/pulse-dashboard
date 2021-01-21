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
  getRiskLevels,
  getRiskLevelLabels,
} from "../../../../utils/transforms/labels";
import getDenominatorKeyByMode from "../utils/getDenominatorKeyByMode";
import getCounts from "../utils/getCounts";
import createRiskLevelsMap from "../utils/createRiskLevelsMap";
import { filterOptimizedDataFormat } from "../../../../utils/charts/dataFilters";

/**
 * These are the only genders that are apparent in the source data set,
 * not all of the genders we would like to represent.
 */
const GENDER_LABELS_MAP = { FEMALE: "Women", MALE: "Men" };

const createGenerateChartData = (dataFilter, stateCode) => ({
  metadata,
  mode,
  apiData,
}) => {
  const numeratorKey = "population_count";
  const denominatorKey = getDenominatorKeyByMode(mode);
  const genders = Object.keys(GENDER_LABELS_MAP);
  const genderLabels = Object.values(GENDER_LABELS_MAP);

  const { dataPoints, numerators, denominators } = pipe(
    () =>
      filterOptimizedDataFormat({ apiData, metadata, filterFn: dataFilter }),
    reduce(createRiskLevelsMap(numeratorKey, denominatorKey, "gender"), {}),
    (data) => getCounts(data, getRiskLevels(stateCode), genders)
  )();

  const generateDataset = (label, index) => ({
    label,
    backgroundColor: applyStatisticallySignificantShadingToDataset(
      CHART_COLORS[index],
      denominators
    ),
    data: dataPoints[index],
  });

  const data = {
    labels: getRiskLevelLabels(stateCode),
    datasets: genderLabels.map(generateDataset),
  };

  return { data, numerators, denominators };
};

export default createGenerateChartData;
