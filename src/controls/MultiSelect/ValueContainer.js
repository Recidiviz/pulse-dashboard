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
import React from "react";
import PropTypes from "prop-types";
import { components } from "react-select";

import { formatSelectOptionValue } from "../utils";
import { optionPropType } from "../propTypes";

const ValueContainer = ({
  allOptions,
  summingOption,
  children,
  isCore,
  ...props
}) => {
  const { selectProps, getValue } = props;
  const selectedOptions = getValue();
  const selectInput = React.Children.map(children, (child) => {
    return child.type === components.Input ? child : null;
  });

  const isAll =
    !selectProps.inputValue &&
    selectedOptions.length === 1 &&
    summingOption &&
    selectedOptions[0].value === summingOption.value;

  const text = isAll
    ? summingOption.label
    : formatSelectOptionValue({
        allOptions,
        summingOption,
        selectedOptions,
        isCore,
      });

  return (
    <components.ValueContainer {...props}>
      {text}
      {selectInput}
    </components.ValueContainer>
  );
};
ValueContainer.defaultProps = { isCore: false, summingOption: null };

ValueContainer.propTypes = {
  allOptions: PropTypes.arrayOf(optionPropType).isRequired,
  summingOption: optionPropType,
  children: PropTypes.node.isRequired,
  getValue: PropTypes.func.isRequired,
  isCore: PropTypes.bool,
  selectProps: PropTypes.shape({
    inputValue: PropTypes.string,
  }).isRequired,
};

export default ValueContainer;
