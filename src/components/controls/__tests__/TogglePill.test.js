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

import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import TogglePill from "../TogglePill";

configure({ adapter: new Adapter() });

describe("TogglePill tests", () => {
  const renderTogglePill = () => {
    return mount(
      <TogglePill
        currentValue="left"
        leftPill={{ label: "Left", value: "left" }}
        rightPill={{ label: "Right", value: "right" }}
        onChange={() => {}}
      />
    );
  };

  it("Should render two options", () => {
    const selector = renderTogglePill();

    expect(selector.find(".TogglePill--button")).toHaveLength(2);
  });

  it("One one option should be checked", () => {
    const selector = renderTogglePill();

    expect(selector.find(".TogglePill--button-selected")).toHaveLength(1);
  });
});
