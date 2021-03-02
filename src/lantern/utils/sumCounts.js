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

import filter from "lodash/fp/filter";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";

/**
 * Sum population of revocation data
 *
 * @param {(string|number)} key
 * @param {Array} data
 * @returns {number}
 */
export const sumCounts = (key, data) =>
  pipe(
    filter((item) => item.district === "ALL"),
    sumBy((item) => toInteger(item[key]))
  )(data);
