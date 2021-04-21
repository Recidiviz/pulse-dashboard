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
import toInteger from "lodash/fp/toInteger";
import sumBy from "lodash/fp/sumBy";

import { calculateRate } from "../utils/rate";
import { translate } from "../../utils/i18nSettings";
import { humanReadableTitleCase } from "../../utils/formatStrings";
import { applyStatisticallySignificantShadingToDataset } from "../utils/significantStatistics";
import getLabelByMode from "../utils/getLabelByMode";
import { COLORS } from "../../assets/scripts/constants/colors";

const createGenerateChartData = (filteredData) => (mode) => {
  const fieldName =
    mode === "exits" ? "exit_count" : "supervision_population_count";
  const riskLevels = translate("riskLevelsMap");
  const riskLevelCounts = pipe(
    filter((data) => Object.keys(riskLevels).includes(data.risk_level)),
    groupBy((d) => [d.risk_level, d.admission_type]),
    values,
    sortBy((dataset) => Object.keys(riskLevels).indexOf(dataset[0].risk_level)),
    map((dataset) => ({
      risk_level: dataset[0].risk_level,
      count: sumBy((item) => toInteger(item.revocation_count), dataset),
      [fieldName]: sumBy((item) => toInteger(item[fieldName]), dataset),
    })),
    groupBy("risk_level"),
    map((dataset) => ({
      risk_level: dataset[0].risk_level,
      count: sumBy((item) => toInteger(item.count), dataset),
      [fieldName]: dataset[0][fieldName],
    })),
    map((dataPoint) => {
      const riskLevelLabel = riskLevels[dataPoint.risk_level];
      const label = humanReadableTitleCase(riskLevelLabel);
      const numerator = dataPoint.count;
      const denominator = dataPoint[fieldName];
      const rate = calculateRate(numerator, denominator);
      return {
        label,
        numerator,
        denominator,
        rate: rate.toFixed(2),
      };
    })
  )(filteredData);

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
