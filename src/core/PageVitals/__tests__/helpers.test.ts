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
import { getSummaryStatus } from "../helpers";

describe("getSummaryStatus", () => {
  describe("when value is less than 70", () => {
    it("returns POOR", () => {
      [0, 15, 25, 69].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("POOR");
      });
    });
  });
  describe("when value is greater than or equal to 70 and less than 80", () => {
    it("returns NEEDS_IMPROVEMENT", () => {
      [70, 75, 79].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("NEEDS_IMPROVEMENT");
      });
    });
  });
  describe("when value is greater than or equal to 80 and less than 90", () => {
    it("returns GOOD", () => {
      [80, 85, 89].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("GOOD");
      });
    });
  });
  describe("when value is greater than or equal to 90 and less than 95", () => {
    it("returns GREAT", () => {
      [90, 94].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("GREAT");
      });
    });
  });
  describe("when value is greater than 95", () => {
    it("returns EXCELLENT", () => {
      [95, 100].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("EXCELLENT");
      });
    });
  });
});
