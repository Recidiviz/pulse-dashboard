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

import { getBarBackgroundColor } from "../../../../utils/charts/significantStatistics";
import {
  getRiskLevelLabels,
  getRiskLevels,
} from "../../../../utils/transforms/labels";
import getDenominatorKeyByMode from "../utils/getDenominatorKeyByMode";
import getCounts from "../utils/getCounts";
import { COLORS_LANTERN_SET } from "../../../../assets/scripts/constants/colors";
import createRiskLevelsMap from "../utils/createRiskLevelsMap";

const RACE_LABELS_MAP = {
  WHITE: "Caucasian",
  BLACK: "African American",
  HISPANIC: "Hispanic",
  ASIAN: "Asian",
  AMERICAN_INDIAN_ALASKAN_NATIVE: "Native American",
  PACIFIC_ISLANDER: "Pacific Islander",
};

const createGenerateChartData = (dataFilter, stateCode) => (apiData, mode) => {
  const numeratorKey = "population_count";
  const denominatorKey = getDenominatorKeyByMode(mode);

  const races = Object.keys(RACE_LABELS_MAP);
  const raceLabels = Object.values(RACE_LABELS_MAP);

  const { dataPoints, numerators, denominators } = pipe(
    dataFilter,
    reduce(createRiskLevelsMap(numeratorKey, denominatorKey, "race"), {}),
    (data) => getCounts(data, getRiskLevels(stateCode), races)
  )(apiData);

  const generateDataset = (label, index) => ({
    label,
    backgroundColor: getBarBackgroundColor(
      COLORS_LANTERN_SET[index],
      denominators
    ),
    data: dataPoints[index],
  });

  const data = {
    labels: getRiskLevelLabels(stateCode),
    datasets: raceLabels.map(generateDataset),
  };

  return {
    data,
    numerators,
    denominators,
  };
};

export default createGenerateChartData;
