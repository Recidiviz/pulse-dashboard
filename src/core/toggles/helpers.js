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

import capitalize from "lodash/fp/capitalize";
import identity from "lodash/fp/identity";
import lowerCase from "lodash/fp/lowerCase";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sortBy from "lodash/fp/sortBy";

import { defaultDistrictOption } from "./options";

const normalizeDistrictName = (replaceLa, stateCode, district) => {
  const isCounty = stateCode !== undefined;

  let normalized = district;

  if (isCounty) {
    normalized = normalized.replace(`${stateCode}_`, "");
  }

  normalized = normalized
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/[^\s\-']+[\s\-']*/g, capitalize)
    .replace(/\b(Van|De|Der|Da|Von)\b/g, lowerCase)
    .replace(/Mc(.)/g, (_, letter3) => `Mc${letter3.toUpperCase()}`);

  if (replaceLa) {
    normalized = normalized.replace(
      /La(.)/g,
      (_, letter3) => `La${letter3.toUpperCase()}`
    );
  }

  if (isCounty) {
    return `${normalized} County`;
  }

  return normalized;
};

const collectDistrictOfficesOptions = pipe(
  sortBy("site_name"),
  map(({ district, site_name: siteName }) => ({
    label: siteName,
    value: district,
  }))
);

const collectDistrictsOptions = pipe(
  sortBy(identity),
  map((district) => ({
    label: district,
    value: district,
  }))
);

const collectOptions = (districts, districtOffices) =>
  districtOffices
    ? collectDistrictOfficesOptions(districtOffices)
    : collectDistrictsOptions(districts);

const prependAllOption = (options) => [defaultDistrictOption, ...options];

const normalizeLabel = (replaceLa, stateCode) => (option) => ({
  ...option,
  label: normalizeDistrictName(replaceLa, stateCode, option.label),
});

export const getDistrictOptions = (
  districts,
  districtOffices,
  replaceLa,
  stateCode
) =>
  pipe(
    collectOptions,
    map(normalizeLabel(replaceLa, stateCode)),
    prependAllOption
  )(districts, districtOffices);
