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
 *   ASIAN: { REVOKED: [1, 4], SUPERVISION_POPULATION: [5, 9], ... } }
 *   HISPANIC: { REVOKED: [2, 9], SUPERVISION_POPULATION: [2, 8], ... } }
 * }
 */

const createRacePopulationMap = (numeratorKey, denominatorKey, field) => (
  acc,
  data
) => {
  // TODO # 784 once the risk_level dimension has been removed, we can remove the
  // sum entirely and use the counts directly from the data row
  return pipe(
    set(
      [data[field], "SUPERVISION_POPULATION"],
      [
        getOr(0, [data[field], "SUPERVISION_POPULATION", 0], acc) +
          toInteger(data[numeratorKey[1]]),
        toInteger(data[denominatorKey[1]]),
      ]
    ),
    set(
      [data[field], "REVOKED"],
      [
        getOr(0, [data[field], "REVOKED", 0], acc) +
          toInteger(data[numeratorKey[0]]),
        toInteger(data[denominatorKey[0]]),
      ]
    )
  )(acc);
};

export default createRacePopulationMap;
