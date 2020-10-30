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
import set from "lodash/fp/set";
import getOr from "lodash/fp/getOr";
import toInteger from "lodash/fp/toInteger";

/**
 * Transform to
 * {
 *   ASIAN: { LOW: [1, 4], HIGH: [5, 9], ... } }
 *   HISPANIC: { LOW: [2, 9], HIGH: [2, 8], ... } }
 * }
 */
const createRiskLevelsMap = (numeratorKey, denominatorKey, field) => (
  acc,
  data
) => {
  return pipe(
    set(
      [data[field], data.risk_level],
      [
        getOr(0, [data[field], data.risk_level, 0], acc) +
          toInteger(data[numeratorKey]),
        getOr(0, [data[field], data.risk_level, 1], acc) +
          toInteger(data[denominatorKey]),
      ]
    ),
    set(
      [data[field], "OVERALL"],
      [
        getOr(0, [data[field], "OVERALL", 0], acc) +
          toInteger(data[numeratorKey]),
        getOr(0, [data[field], "OVERALL", 1], acc) +
          toInteger(data[denominatorKey]),
      ]
    )
  )(acc);
};

export default createRiskLevelsMap;
