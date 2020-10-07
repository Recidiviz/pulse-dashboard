import React from "react";
import PropTypes from "prop-types";
import { components } from "react-select";

import { formatSelectOptionValue } from "../utils";
import { optionPropType } from "../../propTypes";

const ValueContainer = ({ allOptions, summingOption, children, ...props }) => {
  const { selectProps, getValue } = props;
  const values = getValue();

  const selectInput = React.Children.toArray(children).find((input) =>
    ["DummyInput", "Input"].includes(input.type.name)
  );

  const isAll =
    !selectProps.inputValue &&
    values.length === 1 &&
    summingOption &&
    values[0].value === summingOption.value;

  const text = isAll
    ? summingOption.label
    : formatSelectOptionValue(allOptions, summingOption, values);

  return (
    <components.ValueContainer {...props}>
      {text}
      {selectInput}
    </components.ValueContainer>
  );
};

ValueContainer.propTypes = {
  allOptions: PropTypes.arrayOf(optionPropType).isRequired,
  summingOption: optionPropType.isRequired,
  children: PropTypes.node.isRequired,
  getValue: PropTypes.func.isRequired,
  selectProps: PropTypes.shape({
    inputValue: PropTypes.string,
  }).isRequired,
};

export default ValueContainer;
