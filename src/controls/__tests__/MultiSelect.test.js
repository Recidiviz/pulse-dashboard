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
import { render } from "@testing-library/react";

import MultiSelect from "../MultiSelect/MultiSelect";

describe("MultiSelect", () => {
  it("Should not throw error when ref.current does not exist yet", () => {
    const onChange = () => {};
    jest.spyOn(React, "useRef").mockReturnValueOnce({ current: null });
    const renderer = () => {
      render(
        <MultiSelect
          onChange={onChange}
          defaultValue={[{ label: "ALL", value: "ALL" }]}
          value={[{ label: "ALL", value: "ALL" }]}
          options={[
            { label: "ALL", value: "ALL" },
            { label: "02", value: "02" },
          ]}
          summingOption={{ label: "ALL", value: "ALL" }}
        />
      );
    };
    expect(renderer).not.toThrow();
  });
});
