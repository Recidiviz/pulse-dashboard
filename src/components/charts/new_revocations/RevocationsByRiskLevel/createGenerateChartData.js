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
import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import values from "lodash/fp/values";
import sortBy from "lodash/fp/sortBy";
import map from "lodash/fp/map";

import { sumIntBy } from "../helpers/counts";
import { calculateRate } from "../helpers/rate";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { humanReadableTitleCase } from "../../../../utils/transforms/labels";
import { applyStatisticallySignificantShadingToDataset } from "../../../../utils/charts/significantStatistics";
import getDenominatorKeyByMode from "../utils/getDenominatorKeyByMode";
import getLabelByMode from "../utils/getLabelByMode";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const createGenerateChartData = (dataStore) => (mode) => {
  const denominatorKey = getDenominatorKeyByMode(mode);
  const riskLevels = translate("riskLevelsMap");

  const riskLevelCounts = pipe(
    filter((data) => Object.keys(riskLevels).includes(data.risk_level)),
    groupBy("risk_level"),
    values,
    sortBy((dataset) => Object.keys(riskLevels).indexOf(dataset[0].risk_level)),
    map((dataset) => {
      const riskLevelLabel = riskLevels[dataset[0].risk_level];
      const label = humanReadableTitleCase(riskLevelLabel);
      const numerator = sumIntBy("population_count", dataset);
      const denominator = sumIntBy(denominatorKey, dataset);
      const rate = calculateRate(numerator, denominator);
      return {
        label,
        numerator,
        denominator,
        rate: rate.toFixed(2),
      };
    })
  )(dataStore.filteredData);

  const chartDataPoints = map("rate", riskLevelCounts);
  const numerators = map("numerator", riskLevelCounts);
  const denominators = map("denominator", riskLevelCounts);

  const data = {
    labels: map("label", riskLevelCounts),
    datasets: [
      {
        label: getLabelByMode(mode),
        backgroundColor: applyStatisticallySignificantShadingToDataset(
          COLORS["lantern-orange"],
          denominators
        ),
        data: chartDataPoints,
      },
    ],
  };

  return { data, numerators, denominators };
};

export default createGenerateChartData;
