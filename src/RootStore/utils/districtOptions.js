// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import { compareStrings } from ".";

function formatPrimaryLabel(id, label) {
  return `${id} - ${label.toUpperCase().replace(" DO", "")}`;
}

export function generateNestedOptions(districts, districtKeys) {
  const {
    secondaryLabelKey,
    primaryLabelKey,
    primaryIdKey,
    valueKey,
  } = districtKeys;
  const filterOptions = {};

  districts.forEach((district) => {
    const primaryId = district[primaryIdKey];
    const primaryLabel = district[primaryLabelKey];
    const nestedLabel = district[secondaryLabelKey];
    const value = district[valueKey];
    const option = { label: nestedLabel.toUpperCase(), value };

    if (!filterOptions[primaryId]) {
      Object.assign(filterOptions, {
        [primaryId]: {
          sortByLabel: primaryLabel,
          allSelectedLabel: "ALL",
          label: formatPrimaryLabel(primaryId, primaryLabel),
          options: [option],
        },
      });
      return;
    }

    // Options are a unique set
    const labels = filterOptions[primaryId].options.map((o) => o.label);
    if (!labels.includes(nestedLabel)) {
      filterOptions[primaryId].options.push(option);
      filterOptions[primaryId].options.sort(compareStrings("label"));
    }
  });

  const sortedOptions = Object.values(filterOptions).sort(
    compareStrings("sortByLabel")
  );

  return sortedOptions;
}
