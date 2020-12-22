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

import {
  getRiskLevelLabels,
  getRiskLevels,
} from "../../../../utils/transforms/labels";
import getDenominatorKeyByMode from "../utils/getDenominatorKeyByMode";
import getCounts from "../utils/getCounts";
import createRiskLevelsMap from "../utils/createRiskLevelsMap";
import { filterOptimizedDataFormat } from "../../../../utils/charts/dataFilters";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { COLORS_LANTERN_SET } from "../../../../assets/scripts/constants/colors";
import { applyStatisticallySignificantShadingToDataset } from "../../../../utils/charts/significantStatistics";

export const generateDatasets = (dataPoints, denominators) => {
  const raceLabelMap = translate("raceLabelMap");
  const raceLabels = Object.values(raceLabelMap);

  return raceLabels.map((raceLabel, index) => ({
    label: raceLabel,
    backgroundColor: applyStatisticallySignificantShadingToDataset(
      COLORS_LANTERN_SET[index],
      denominators
    ),
    data: dataPoints[index],
  }));
};

const createGenerateChartData = (dataFilter) => (
  apiData,
  mode,
  unflattenedValues
) => {
  const numeratorKey = "population_count";
  const denominatorKey = getDenominatorKeyByMode(mode);

  const raceLabelMap = translate("raceLabelMap");
  const races = Object.keys(raceLabelMap);

  const { dataPoints, numerators, denominators } = pipe(
    (metricFile) =>
      filterOptimizedDataFormat(
        unflattenedValues,
        apiData,
        metricFile.metadata,
        dataFilter
      ),
    reduce(createRiskLevelsMap(numeratorKey, denominatorKey, "race"), {}),
    (data) => getCounts(data, getRiskLevels(), races)
  )(apiData);

  const data = {
    labels: getRiskLevelLabels(),
    datasets: generateDatasets(dataPoints, denominators),
  };

  return { data, numerators, denominators };
};

export default createGenerateChartData;
