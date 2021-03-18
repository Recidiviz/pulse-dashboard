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

import tk from "timekeeper";
import { getTimeDescription } from "../format";

describe("getTimeDescription", () => {
  const testDate = new Date("2021-04-01");
  tk.freeze(testDate);
  let admissionOptions = [{ label: "All", value: "all" }];
  let admissionType = ["All"];
  let months = "12";
  let admissionTypeEnabled = false;

  describe("when admission type component is not enabled", () => {
    it("returns just the time period label", () => {
      expect(
        getTimeDescription(
          months,
          admissionTypeEnabled,
          admissionOptions,
          admissionType
        )
      ).toEqual("Last 12 months (5/1/2020 to present)");
    });
  });

  describe("when admission type component is enabled", () => {
    it("returns the time period label with a list of admission types", () => {
      admissionTypeEnabled = true;
      months = "36";
      admissionOptions = admissionOptions.concat([
        { label: "PVC", value: "PVC" },
        { label: "SCI - All Short Term", value: "SCI" },
      ]);
      admissionType = ["PVC", "SCI"];
      expect(
        getTimeDescription(
          months,
          admissionTypeEnabled,
          admissionOptions,
          admissionType
        )
      ).toEqual(
        "Last 3 years (5/1/2018 to present); PVC, SCI - All Short Term"
      );
    });
  });

  it("returns the time period label when no admission type is selected", () => {
    admissionTypeEnabled = true;
    months = "3";
    admissionOptions = admissionOptions.concat([
      { label: "PVC", value: "PVC" },
      { label: "SCI - All Short Term", value: "SCI" },
    ]);
    admissionType = ["all"];
    expect(
      getTimeDescription(
        months,
        admissionTypeEnabled,
        admissionOptions,
        admissionType
      )
    ).toEqual("Last 3 months (2/1/2021 to present)");
  });
});
