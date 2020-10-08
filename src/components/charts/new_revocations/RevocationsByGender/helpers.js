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
import { calculateRate } from "../helpers/rate";
import { translate } from "../../../../views/tenants/utils/i18nSettings";

/**
 * These are the only genders that are apparent in the source data set,
 * not all of the genders we would like to represent.
 */
const GENDERS = ["FEMALE", "MALE"];
const RISK_LEVELS = [
  "OVERALL",
  "NOT_ASSESSED",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

export const getCounts = (transformedData) => {
  const dataPoints = [];
  const numerators = [];
  const denominators = [];

  GENDERS.forEach((gender, i) => {
    dataPoints.push([]);
    numerators.push([]);
    denominators.push([]);

    RISK_LEVELS.forEach((riskLevel) => {
      const numerator = getOr(0, [gender, riskLevel, 0], transformedData);
      const denominator = getOr(0, [gender, riskLevel, 1], transformedData);
      const rate = calculateRate(numerator, denominator).toFixed(2);

      numerators[i].push(numerator);
      denominators[i].push(denominator);
      dataPoints[i].push(rate);
    });
  });

  return { dataPoints, numerators, denominators };
};

export const findDenominatorKeyByMode = (mode) => {
  switch (mode) {
    case "rates":
    default:
      return "total_supervision_count";
    case "exits":
      return "total_exit_count";
  }
};

export const getLabelByMode = (mode) => {
  switch (mode) {
    case "rates":
    default:
      return translate("percentOfPopulationRevoked");
    case "exits":
      return "Percent revoked out of all exits";
  }
};

/**
 * Transform to
 * {
 *   FEMALE: { LOW: [1, 4], HIGH: [5, 9], ... } }
 *   MALE: { LOW: [2, 9], HIGH: [2, 8], ... } }
 * }
 */
export const dataTransformer = (numeratorKey, denominatorKey) => (acc, data) =>
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
