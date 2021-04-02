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
import {
  getPathsFromNavigation,
  getPathWithoutParams,
  convertIdToSlug,
  convertSlugToId,
} from "../navigation";
import tenants from "../../tenants";

jest.mock("../../flags", () => ({
  showMethodologyDropdown: false,
  enableVitalsDashboard: true,
}));

describe("getPathsFromNavigation", () => {
  it("returns the correct allowed paths path for US_ND", () => {
    const allowedPaths = getPathsFromNavigation(tenants.US_ND.navigation);
    const expected = [
      "/goals",
      "/community/explore",
      "/community/vitals",
      "/facilities/explore",
    ];
    expect(allowedPaths).toEqual(expected);
  });

  it("returns the correct allowed paths path for US_ID", () => {
    const allowedPaths = getPathsFromNavigation(tenants.US_ID.navigation);
    const expected = ["/community/projections", "/facilities/projections"];
    expect(allowedPaths).toEqual(expected);
  });
});

describe("getPathWithoutParams", () => {
  it("returns the full path when given a path without params", () => {
    const path = "/community/vitals";
    expect(getPathWithoutParams(path)).toEqual(path);
  });

  it("returns the path without params when given a path with params", () => {
    const basePath = "/community/vitals";
    expect(getPathWithoutParams(`${basePath}/office-a`)).toEqual(basePath);
  });
});

describe("convertIdToSlug", () => {
  it("returns the id with dashes instead of underscore and lower case", () => {
    const id = "123_OFFICER_JONES";
    expect(convertIdToSlug(id)).toEqual("123-officer-jones");
  });
});

describe("convertSlugToId", () => {
  it("returns the id with underscores instead of dashes and upper case", () => {
    const id = "123-officer-jones";
    expect(convertSlugToId(id)).toEqual("123_OFFICER_JONES");
  });
});
