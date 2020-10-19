import React from "react";
import { act, render } from "@testing-library/react";

import ToggleBarFilter from "../ToggleBarFilter";
import Select from "../../../../controls/Select";
import FilterField from "../FilterField";

jest.mock("../../../../controls/Select", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../FilterField", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("ToggleBarFilter tests", () => {
  const mockLabel = "some label";
  const mockValue = "some value";
  const mockDefaultOption = {
    value: "default option value",
    label: "some option label",
  };
  const mockSelectedOption = {
    value: mockValue,
    label: "mock selected option",
  };
  const mockExtraOption = { value: "some other value", label: "another label" };
  const mockOptions = [mockDefaultOption, mockSelectedOption, mockExtraOption];
  const mockOnChange = jest.fn();

  Select.mockReturnValue(null);
  FilterField.mockImplementation(({ children }) => children);

  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <ToggleBarFilter
        label={mockLabel}
        value={mockValue}
        options={mockOptions}
        defaultOption={mockDefaultOption}
        onChange={mockOnChange}
      />
    );
  });

  it("should pass valid props to Select", () => {
    expect(Select).toHaveBeenCalledTimes(1);
    expect(Select.mock.calls[0][0]).toMatchObject({
      value: mockSelectedOption,
      options: mockOptions,
      defaultValue: mockDefaultOption,
    });
  });

  it("should trigger onChange with value", () => {
    act(() => {
      Select.mock.calls[0][0].onChange(mockExtraOption);
    });

    expect(mockOnChange).toBeCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockExtraOption.value);
  });
});
