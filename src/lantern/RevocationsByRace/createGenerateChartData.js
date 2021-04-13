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
  getStatePopulations,
  getStatePopulationsLabels,
} from "../../utils/formatStrings";
import getCounts from "../utils/getCounts";
import createPopulationMap from "../utils/createPopulationMap";
import { translate } from "../../utils/i18nSettings";
import { COLORS_LANTERN_SET } from "../../assets/scripts/constants/colors";
import { applyStatisticallySignificantShadingToDataset } from "../utils/significantStatistics";

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

const createGenerateChartData = ({ filteredData, statePopulationData }) => (
  mode
) => {
  const raceLabelMap = translate("raceLabelMap");
  const races = Object.keys(raceLabelMap);
  const { dataPoints, numerators, denominators } = pipe(
    reduce(createPopulationMap("race"), {}),
    (data) =>
      getCounts(
        data,
        getStatePopulations(),
        races,
        statePopulationData,
        "race_or_ethnicity"
      )
  )(filteredData);

  const datasets = generateDatasets(dataPoints, denominators);
  const datasetIndex = datasets.findIndex(
    (d) => d.label === translate("raceLabelMap")[mode]
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

export default createGenerateChartData;
