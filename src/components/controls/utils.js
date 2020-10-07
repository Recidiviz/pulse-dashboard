import map from "lodash/fp/map";
import filter from "lodash/fp/filter";

export const excludeOption = (options, optionToExclude) =>
  options.filter((option) => optionToExclude.value !== option.value);

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

export const formatSelectOptionValue = (
  allOptions,
  summingOption,
  selectedOptions,
  isShortFormat = true
) => {
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

  if (isShortFormat) {
    return `${selectedOptions.length} Items selected`;
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
    selectedValues.length > 1 &&
    selectedValues[selectedValues.length - 1] === summingOption.value;

  const isAllOptionsSelected = options.every((o) =>
    selectedValues.includes(o.value)
  );

  if (isNoOptionsSelected || isSummingOptionSelected || isAllOptionsSelected) {
    return [summingOption];
  }

  if (selectedValues.includes(summingOption.value)) {
    return selectedOptions.filter((o) => o.value !== summingOption.value);
  }

  return selectedOptions;
};
