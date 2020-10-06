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

import { applyTopLevelFilters } from "../helpers";
import defaultFiltersMO from "../../../../views/tenants/us_mo/community/Revocations";

describe("applyTopLevelFilters", () => {
  let filters = {}
  let filtered = []
  const data = [
    {
      charge_category: "ALL",
      district: "ALL",
      month: "1",
      reported_violations: "1",
      state_code: "US_PA",
      supervision_level: "ALL",
      supervision_type: "PAROLE",
      total_revocations: "35",
      violation_type: "MED_TECH",
      year: "2020",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      month: "1",
      reported_violations: "1",
      state_code: "US_PA",
      supervision_level: "MEDIUM",
      supervision_type: "PAROLE",
      total_revocations: "5",
      violation_type: "MED_TECH",
      year: "2020",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      month: "1",
      reported_violations: "1",
      state_code: "US_PA",
      supervision_level: "MEDIUM",
      supervision_type: "PAROLE",
      total_revocations: "10",
      violation_type: "MED_TECH",
      year: "2020",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      month: "1",
      reported_violations: "1",
      state_code: "US_PA",
      supervision_level: "MINIMUM",
      supervision_type: "PAROLE",
      total_revocations: "20",
      violation_type: "MED_TECH",
      year: "2020",
    },
  ]

  describe("with supervision_level = 'MEDIUM' filter applied", () => {
    beforeEach(() => {
      filters = { supervisionLevel: "MEDIUM" }
      filtered = applyTopLevelFilters(filters, true)(data)
    })

    it("correctly returns supervision_level items matching the filter term", () => {
      const expected = [data[1], data[2]];

      expect(filtered).toEqual(expected);
    });

    it("does not double count the 'ALL' item", () => {
      expect(filtered).not.toContain(data[0])
    });
  })

  describe("with supervision_level = 'ALL' filter applied (default)", () => {
    beforeEach(() => {
      filters = { supervisionLevel: "ALL" }
      filtered = applyTopLevelFilters(filters, true)(data)
    })

    it("returns the 'ALL' row", () => {
      const expected = [data[0]];
      expect(filtered).toEqual(expected);
    });
  })
});
