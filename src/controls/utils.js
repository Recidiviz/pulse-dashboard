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

import map from "lodash/fp/map";
import filter from "lodash/fp/filter";

export const excludeOption = (options, optionToExclude) => {
  if (!optionToExclude) return options;
  return options.filter((option) => optionToExclude.value !== option.value);
};

/**
 * Flats grouped options that have value to flat list
 ([
 { value: "All", label: "ALL" },
 { value: "REVOCATION", label: "Revocation" },
 {
    label: "SCI",
    options: [
     { value: "SCI_6", label: "SCI 6 months" },
     { label: "SCI 12 months" },
    ],
    },
 { value: "DA_DETOX", label: "D&A Detox" },
 { label: "Mental Health" },
 ], { value: "All", label: "ALL" })  =>
 [
 { value: "All", label: "ALL" },
 { value: "REVOCATION", label: "Revocation" },
 { value: "SCI_6", label: "SCI 6 months" },
 { value: "DA_DETOX", label: "D&A Detox" },
 ]
 * @param options
 * @returns {*}
 */
export const flatOptions = (options) =>
  options.reduce(
    (acc, option) => [
      ...acc,
      ...(option.value ? [option] : []),
      ...(option.options ? filter("value", option.options) : []),
    ],
    []
  );

export const formatSelectOptionValue = ({
  allOptions,
  selectedOptions,
  isCore,
  summingOption,
  isShortFormat = true,
}) => {
  const selectedValues = map("value", selectedOptions);

  // show option label if only one selected
  if (selectedValues.length === 1) {
    const options = excludeOption(flatOptions(allOptions), summingOption);
    const option = options.find((o) => o.value === selectedValues[0]);
    return option ? option.label : "";
  }

  // show group label if all options in the only one group selected
  const selectedGroups = allOptions
    .filter((o) => o.options)
    .filter((group) =>
      group.options.every((o) => selectedValues.includes(o.value))
    );
  if (
    selectedGroups.length === 1 &&
    selectedGroups[0].options.length === selectedValues.length
  ) {
    return `${selectedGroups[0].label} - ${selectedGroups[0].allSelectedLabel}`;
  }

  // labels for core filters
  if (isCore) {
    return `${selectedOptions[0].label} and ${selectedOptions.length - 1} more`;
  }

  if (isShortFormat) {
    return `${selectedOptions.length} Items`;
  }

  const groupOptions = excludeOption(
    flatOptions(selectedGroups),
    summingOption
  );
  const optionLabels = selectedOptions
    .filter(
      (option) =>
        !groupOptions.find((groupOption) => groupOption.value === option.value)
    )
    .map((option) => option.label);
  const groupLabels = map(
    (group) => `${group.label} - ${group.allSelectedLabel}`,
    selectedGroups
  );

  return optionLabels.concat(groupLabels).join(", ");
};

export const getNewOptions = (
  allOptions,
  summingOption,
  selectedOptions = []
) => {
  const options = excludeOption(flatOptions(allOptions), summingOption);
  const selectedValues = map("value", selectedOptions);

  const isNoOptionsSelected = selectedValues.length === 0;

  const isSummingOptionSelected =
    summingOption &&
    selectedValues.length > 1 &&
    selectedValues[selectedValues.length - 1] === summingOption.value;

  const isAllOptionsSelected = options.every((o) =>
    selectedValues.includes(o.value)
  );

  if (isNoOptionsSelected || isSummingOptionSelected || isAllOptionsSelected) {
    return [summingOption];
  }

  if (summingOption && selectedValues.includes(summingOption.value)) {
    return selectedOptions.filter((o) => o.value !== summingOption.value);
  }

  return selectedOptions;
};
