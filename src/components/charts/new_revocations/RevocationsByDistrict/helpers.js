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

import orderBy from "lodash/fp/orderBy";
import reduce from "lodash/fp/reduce";
import toPairs from "lodash/fp/toPairs";

const transformToMap = (key) =>
  reduce(
    (result, { district, [key]: field }) =>
      district === "ALL"
        ? result
        : {
            ...result,
            [district]: (result[district] || 0) + (parseInt(field, 10) || 0),
          },
    {}
  );

const sumPopulation = (key, data) =>
  data.reduce((acc, item) => {
    if (item.district === "ALL") {
      return acc + (parseInt(item[key], 10) || 0);
    }
    return acc;
  }, 0);

export const transformRevocationDataToMap = transformToMap("population_count");
export const tranformSupervisionDataToMap = transformToMap("total_population");

export const uniteMaps = (revocationMap, supervisionMap) =>
  toPairs(revocationMap).map(([district, count]) => {
    const total = supervisionMap[district];
    const rate = total === 0 || count === 0 ? 0 : (100 * count) / total;
    return { district, count, total, rate };
  });

export const sortByCount = orderBy(["count"], ["desc"]);
export const sortByRate = orderBy(["rate"], ["desc"]);

export const calculateAverageRate = (revocationData, supervisionData) => {
  const numerator = sumPopulation("population_count", revocationData);
  const denominator = sumPopulation("total_population", supervisionData);
  return denominator === 0 || numerator === 0
    ? 0
    : (100 * numerator) / denominator;
};
