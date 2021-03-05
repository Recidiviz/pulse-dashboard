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

const NUMERATOR_KEYS = [
  "revocation_count",
  "recommended_for_revocation_count",
  "supervision_population_count",
];
const DENOMINATOR_KEYS = [
  "revocation_count_all",
  "recommended_for_revocation_count_all",
  "supervision_count_all",
];

/**
 * Transform to
 *   ASIAN: { REVOKED: [1, 4], SUPERVISION_POPULATION: [5, 9],
 *            RECOMMENDED_FOR_REVOCATION: [3, 6], ... } }
 *   HISPANIC: { REVOKED: [2, 9], SUPERVISION_POPULATION: [2, 8],
 *               RECOMMENDED_FOR_REVOCATION: [3, 6], ... } }
 * OR
 *   MALE: { REVOKED: [1, 4], SUPERVISION_POPULATION: [5, 9],
 *           RECOMMENDED_FOR_REVOCATION: [3, 6], ... } }
 *   FEMALE: { REVOKED: [2, 9], SUPERVISION_POPULATION: [2, 8],
 *             RECOMMENDED_FOR_REVOCATION: [3, 6], ... } }
 */
const createPopulationMap = (field) => (acc, data) => {
  return pipe(
    set(
      [data[field], "SUPERVISION_POPULATION"],
      [
        getOr(0, [data[field], "SUPERVISION_POPULATION", 0], acc) +
          toInteger(data[NUMERATOR_KEYS[2]]),
        getOr(0, [data[field], "SUPERVISION_POPULATION", 1], acc) +
          toInteger(data[DENOMINATOR_KEYS[2]]),
      ]
    ),
    set(
      [data[field], "REVOKED"],
      [
        getOr(0, [data[field], "REVOKED", 0], acc) +
          toInteger(data[NUMERATOR_KEYS[0]]),
        getOr(0, [data[field], "REVOKED", 1], acc) +
          toInteger(data[DENOMINATOR_KEYS[0]]),
      ]
    ),
    set(
      [data[field], "RECOMMENDED_FOR_REVOCATION"],
      [
        getOr(0, [data[field], "RECOMMENDED_FOR_REVOCATION", 0], acc) +
          toInteger(data[NUMERATOR_KEYS[1]]),
        getOr(0, [data[field], "RECOMMENDED_FOR_REVOCATION", 1], acc) +
          toInteger(data[DENOMINATOR_KEYS[1]]),
      ]
    )
  )(acc);
};

export default createPopulationMap;
