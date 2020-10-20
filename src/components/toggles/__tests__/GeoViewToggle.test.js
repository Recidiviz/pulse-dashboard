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
import { getByText, fireEvent } from "@testing-library/dom";
import { render } from "@testing-library/react";
import GeoViewToggle from "../GeoViewToggle";

describe("GeoViewToggle", () => {
  const props = {
    setGeoViewEnabled: jest.fn(),
  };

  it("should render default component", () => {
    const { container } = render(<GeoViewToggle {...props} />);
    expect(getByText(container, "Map")).toBeTruthy();
  });

  it("should be toggled", async () => {
    const { container } = render(<GeoViewToggle {...props} />);

    await fireEvent(
      getByText(container, "Map"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(getByText(container, "Graph")).toBeTruthy();
  });
});
