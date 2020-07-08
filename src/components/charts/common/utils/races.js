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

import concat from "lodash/fp/concat";
import difference from "lodash/fp/difference";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import { raceValueToHumanReadable } from "../../../../utils/transforms/labels";

/**
 * Groups and casts to object:
 * [{ race: 'Asian', totalSupervisionCount: 43, revocationCount: 123 }, ...]
 */
export const groupByRaceAndMap = (counts) =>
  pipe(
    groupBy("race_or_ethnicity"),
    values,
    map((dataset) => ({
      race: raceValueToHumanReadable(dataset[0].race_or_ethnicity),
      ...reduce(
        (acc, countKey) => ({
          ...acc,
          [countKey]: sumBy((o) => toInteger(o[countKey]), dataset),
        }),
        {},
        counts
      ),
    }))
  );

/**
 * If dataset doesn't have all races, added missed races with zero counts to this dataset.
 *
 * @param countKeys Example ["count", "total_supervision_count"]
 * @param stateCensusDataPoints All races
 */
export const addMissedRaceCounts = (countKeys, stateCensusDataPoints) => (
  dataset
) =>
  pipe(
    map("race"),
    difference(map("race", stateCensusDataPoints)),
    map((race) => ({
      race,
      ...reduce((acc, countKey) => ({ ...acc, [countKey]: 0 }), {}, countKeys),
    })),
    concat(dataset)
  )(dataset);

export const countMapper = (countKey) => ({ race, [countKey]: count }) => ({
  race,
  value: count,
});

export const stateCensusMapper = ({ race_or_ethnicity: race, proportion }) => ({
  race: raceValueToHumanReadable(race),
  proportion: Number(proportion),
});
