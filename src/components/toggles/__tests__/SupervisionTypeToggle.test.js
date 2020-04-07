// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import { fireEvent, getByLabelText, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SupervisionTypeToggle from "../SupervisionTypeToggle";

describe("test for component SupervisionTypeToggle", () => {
  const props = {
    onSupervisionTypeUpdate: jest.fn(),
  };
  async function runSupervisionChangeTest(periodSelection, expectedValue) {
    const handleChange = jest.fn();
    fireEvent.change(periodSelection, { target: { value: expectedValue } });
    expect(periodSelection.value).toEqual(expectedValue);
    await waitFor(() => expect(handleChange).toHaveBeenCalledTimes(1));
    expect(props.onSupervisionTypeUpdate).toHaveBeenCalledTimes(1);
    expect(periodSelection.checked).toHaveAttribute("checked", expectedValue);
  }

  it("display all elements in component", () => {
    const { container } = render(<SupervisionTypeToggle {...props} />);
    const inputValueAll = getByLabelText(container, "Everyone", {
      selector: "input",
    });
    expect(inputValueAll.value).toBe("all");

    const inputValueProbation = getByLabelText(
      container,
      "Individuals on probation",
      {
        selector: "input",
      }
    );
    expect(inputValueProbation.value).toBe("probation");

    const inputValueParole = getByLabelText(
      container,
      "Individuals on parole",
      {
        selector: "input",
      }
    );
    expect(inputValueParole.value).toBe("parole");
  });

  it("supervision type contains Individuals on probation", () => {
    const { container } = render(<SupervisionTypeToggle {...props} />);
    const inputValueProbation = container.querySelector(
      "input[value='probation']"
    );
    runSupervisionChangeTest(inputValueProbation, "probation");
  });

  it("supervision type contains Individuals on parole", () => {
    const { container } = render(<SupervisionTypeToggle {...props} />);
    const inputValueParole = container.querySelector("input[value='parole']");
    runSupervisionChangeTest(inputValueParole, "parole");
  });

  it("supervision type contains everyone", () => {
    const { container } = render(<SupervisionTypeToggle {...props} />);
    const inputValueAll = container.querySelector("input[value='all']");
    runSupervisionChangeTest(inputValueAll, "all");
  });
});
