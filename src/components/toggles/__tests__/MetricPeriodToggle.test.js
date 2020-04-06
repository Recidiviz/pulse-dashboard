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
import MetricPeriodToggle from "../MetricPeriodToggle";

describe("test for component MetricPeriodToggle", () => {
  const props = {
    onMetricPeriodMonthsUpdate: jest.fn(),
  };

  async function runPeriodChangeTest(periodSelection, expectedValue) {
    const handleChange = jest.fn();
    fireEvent.change(periodSelection, { target: { value: expectedValue } });
    expect(periodSelection.value).toEqual(expectedValue);
    await waitFor(() => expect(handleChange).toHaveBeenCalledTimes(1));
    expect(props.onMetricPeriodMonthsUpdate).toHaveBeenCalledTimes(1);
    expect(periodSelection.checked).toHaveAttribute("checked", expectedValue);
  }

  it("display all input in form", () => {
    const { container } = render(<MetricPeriodToggle {...props} />);

    const inputValue36 = container.querySelector("input[value='36']");
    expect(inputValue36.value).toBe("36");

    const inputValue12 = container.querySelector("input[value='12']");
    expect(inputValue12.value).toBe("12");

    const inputValue6 = container.querySelector("input[value='6']");
    expect(inputValue6.value).toBe("6");

    const inputValue3 = container.querySelector("input[value='3']");
    expect(inputValue3.value).toBe("3");

    const inputValue1 = container.querySelector("input[value='1']");
    expect(inputValue1.value).toBe("1");
  });

  it("metric period contains 3y", () => {
    const { container } = render(<MetricPeriodToggle {...props} />);
    const inputValue36 = getByLabelText(container, "3y", {
      selector: "input",
    });
    runPeriodChangeTest(inputValue36, "36");
  });

  it("metric period contains 6m", () => {
    const { container } = render(<MetricPeriodToggle {...props} />);
    const inputValue6 = getByLabelText(container, "6m", {
      selector: "input",
    });
    runPeriodChangeTest(inputValue6, "6");
  });

  it("metric period contains 3m", () => {
    const { container } = render(<MetricPeriodToggle {...props} />);

    const inputValue3 = getByLabelText(container, "3m", {
      selector: "input",
    });
    runPeriodChangeTest(inputValue3, "3");
  });

  it("metric period contains 1m", () => {
    const { container } = render(<MetricPeriodToggle {...props} />);
    const inputValue1 = getByLabelText(container, "1m", {
      selector: "input",
    });
    runPeriodChangeTest(inputValue1, "1");
  });

  it("metric period contains 1y", () => {
    const { container } = render(<MetricPeriodToggle {...props} />);
    const inputValue12 = getByLabelText(container, "1y", {
      selector: "input",
    });
    runPeriodChangeTest(inputValue12, "12");
  });
});
