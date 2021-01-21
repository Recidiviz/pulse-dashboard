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

import { getQueryStringFromFilters } from "../DataStore/helpers";

describe("getQueryStringFromFilters", () => {
  let filters;

  beforeEach(() => {
    filters = { district: ["All"], chargeCategory: "GENERAL" };
  });

  it("returns an empty string when there are no filters", () => {
    expect(getQueryStringFromFilters({})).toEqual("");
  });

  it("returns a query string", () => {
    expect(getQueryStringFromFilters(filters)).toEqual(
      "?district[0]=All&chargeCategory=GENERAL"
    );
  });

  it("filters out empty values", () => {
    filters = { ...filters, violationType: "", supervisionType: "All" };
    expect(getQueryStringFromFilters(filters)).toEqual(
      "?district[0]=All&chargeCategory=GENERAL&supervisionType=All"
    );
  });
});
