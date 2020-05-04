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

import "@testing-library/jest-dom/extend-expect";
import tk from "timekeeper";
import { getYearFromNow } from "../years";

describe("#getYearFromNow", () => {
  let now;
  beforeAll(() => {
    now = new Date("2020-02-14T11:01:58.135Z");
    tk.freeze(now);
  });

  it("get last year", () => {
    expect(getYearFromNow(-1)).toEqual("2019");
  });

  it("get year before last", () => {
    expect(getYearFromNow(-2)).toEqual("2018");
  });
});
