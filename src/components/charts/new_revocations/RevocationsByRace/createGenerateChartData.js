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
  getStateRacePopulationLabels,
  getStateRacePopulation,
} from "../../../../utils/transforms/labels";
import getCounts from "../utils/getCounts";
import createRaceRiskLevelsMap from "../utils/createStateRacePopulationMap";
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
  const raceLabelMap = translate("raceLabelMap");
  const races = Object.keys(raceLabelMap);
  const { dataPoints, numerators, denominators } = pipe(
    reduce(createRaceRiskLevelsMap(numeratorKey, denominatorKey, "race"), {}),
    (data) =>
      getCounts(data, getStateRacePopulation(), races, statePopulationData)
  )(filteredData);

  const data = {
    labels: getStateRacePopulationLabels(),
    datasets: generateDatasets(dataPoints, denominators),
  };

  return { data, numerators, denominators };
};

export default createGenerateChartData;
