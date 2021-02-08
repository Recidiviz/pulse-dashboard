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

import { observable } from "mobx";

import { applyTopLevelFilters, applyMatrixFilters } from "../helpers";

describe("applyTopLevelFilters", () => {
  let filters = {};
  let filtered = [];
  let data = [];

  beforeEach(() => {
    data = [
      {
        charge_category: "ALL",
        district: "ALL",
        level_1_supervision_location: "ALL",
        level_2_supervision_location: "ROCKYROAD",
        month: "1",
        reported_violations: "1",
        state_code: "US_PA",
        supervision_level: "ALL",
        supervision_type: "ALL",
        total_revocations: "35",
        violation_type: "MED_TECH",
        year: "2020",
      },
      {
        charge_category: "ALL",
        district: "ALL",
        level_1_supervision_location: "04B",
        level_2_supervision_location: "ALL",
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
        charge_category: "SEX_OFFENSE",
        district: "ALL",
        level_1_supervision_location: "ALL",
        level_2_supervision_location: "ALL",
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
        charge_category: "SEX_OFFENSE",
        district: "ALL",
        level_1_supervision_location: "05X",
        level_2_supervision_location: "VANILLA",
        month: "1",
        reported_violations: "1",
        state_code: "US_PA",
        supervision_level: "MINIMUM",
        supervision_type: "PROBATION",
        total_revocations: "20",
        violation_type: "MED_TECH",
        year: "2020",
      },
    ];
  });

  describe("supervisionLevel filter", () => {
    let filteredSupervisionLevels = [];

    describe("with supervisionLevel = 'MEDIUM' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ supervisionLevel: "MEDIUM" });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredSupervisionLevels = filtered.map((f) => f.supervision_level);
      });

      it("correctly returns supervision_level items matching the filter term", () => {
        const expected = ["MEDIUM", "MEDIUM"];

        expect(filteredSupervisionLevels).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredSupervisionLevels).not.toContain("ALL");
      });
    });

    describe("with supervisionLevel = 'ALL' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ supervisionLevel: "ALL" });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredSupervisionLevels = filtered.map((f) => f.supervision_level);
      });

      it("returns the 'ALL' row", () => {
        const expected = ["ALL"];

        expect(filteredSupervisionLevels).toEqual(expected);
      });
    });

    describe("when the filters do not include supervisionLevel attribute", () => {
      beforeEach(() => {
        filters = observable.map({});
        filtered = applyTopLevelFilters({ filters })(data);
      });

      it("returns the input data", () => {
        expect(filtered).toEqual(data);
      });
    });

    // This is the case for the CaseTable because the
    // revocations_matrix_filtered_caseload endpoint does not include 'ALL' rows
    describe("when the treatCategoryAllAsAbsent flag is true", () => {
      let missingCategoryAllData;
      const treatCategoryAllAsAbsent = true;

      beforeEach(() => {
        missingCategoryAllData = data.slice(1);
        filters = observable.map({ supervisionLevel: "ALL" });
        filtered = applyTopLevelFilters({
          filters,
          skippedFilters: [],
          treatCategoryAllAsAbsent,
        })(missingCategoryAllData);
      });

      it("returns all of the rows", () => {
        expect(filtered).toEqual(missingCategoryAllData);
      });

      describe("when an item supervision_level is null", () => {
        beforeEach(() => {
          missingCategoryAllData.push({
            charge_category: "NOT_ALL",
            district: "NOT_ALL",
            month: "1",
            reported_violations: "1",
            state_code: "US_PA",
            supervision_level: null,
            supervision_type: "PAROLE",
            total_revocations: "20",
            violation_type: "MED_TECH",
            year: "2020",
          });
        });

        // The only time a null should pass through a filter is when
        // treatCategoryAllAsAbsent = true and the filter = 'ALL'
        describe("with supervisionLevel = 'ALL' filter applied", () => {
          beforeEach(() => {
            filters = observable.map({ supervisionLevel: "ALL" });
            filtered = applyTopLevelFilters({
              filters,
              skippedFilters: [],
              treatCategoryAllAsAbsent,
            })(missingCategoryAllData);
            filteredSupervisionLevels = filtered.map(
              (f) => f.supervision_level
            );
          });

          it("returns the all of the rows including the null row", () => {
            const expected = ["MEDIUM", "MEDIUM", "MINIMUM", null];
            expect(filteredSupervisionLevels).toEqual(expected);
          });
        });

        // Even with treatCategoryAllAsAbsent = true, do not pass nulls through
        // if the supervisionLevel filter is not 'ALL'
        describe("with supervisionLevel = 'MEDIUM' filter applied", () => {
          beforeEach(() => {
            filters = observable.map({ supervisionLevel: "MEDIUM" });
            filtered = applyTopLevelFilters({
              filters,
              skippedFilters: [],
              treatCategoryAllAsAbsent,
            })(missingCategoryAllData);
            filteredSupervisionLevels = filtered.map(
              (f) => f.supervision_level
            );
          });

          it("returns only the rows matching the filter", () => {
            const expected = ["MEDIUM", "MEDIUM"];
            expect(filteredSupervisionLevels).toEqual(expected);
          });
        });
      });
    });

    // When treatCategoryAllAsAbsent is false, never let nulls pass through
    // the filter
    describe("when the treatCategoryAllAsAbsent flag is false", () => {
      const treatCategoryAllAsAbsent = false;

      describe("when an item supervision_level is null", () => {
        beforeAll(() => {
          data.push({
            charge_category: "ALL",
            district: "ALL",
            month: "1",
            reported_violations: "1",
            state_code: "US_PA",
            supervision_level: null,
            supervision_type: "PAROLE",
            total_revocations: "20",
            violation_type: "MED_TECH",
            year: "2020",
          });
        });

        describe("with supervisionLevel = 'ALL' filter applied", () => {
          beforeEach(() => {
            filters = observable.map({ supervisionLevel: "ALL" });
            filtered = applyTopLevelFilters({
              filters,
              skippedFilters: [],
              treatCategoryAllAsAbsent,
            })(data);
            filteredSupervisionLevels = filtered.map(
              (f) => f.supervision_level
            );
          });

          it("returns only the 'ALL' row", () => {
            const expected = ["ALL"];
            expect(filteredSupervisionLevels).toEqual(expected);
          });
        });

        describe("with supervisionLevel = 'MEDIUM' filter applied", () => {
          beforeEach(() => {
            filters = observable.map({ supervisionLevel: "MEDIUM" });
            filtered = applyTopLevelFilters({
              filters,
              skippedFilters: [],
              treatCategoryAllAsAbsent,
            })(data);
            filteredSupervisionLevels = filtered.map(
              (f) => f.supervision_level
            );
          });

          it("returns only the rows matching the filter", () => {
            const expected = ["MEDIUM", "MEDIUM"];
            expect(filteredSupervisionLevels).toEqual(expected);
          });
        });
      });
    });
  });

  describe("chargeCategory filter", () => {
    let filteredChargeCategories = [];

    describe("with chargeCategory = 'ALL' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ chargeCategory: "ALL" });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredChargeCategories = filtered.map((f) => f.charge_category);
      });

      it("correctly returns charge_category items matching the filter term", () => {
        const expected = ["ALL", "ALL"];
        expect(filteredChargeCategories).toEqual(expected);
      });
    });

    describe("with chargeCategory = 'SEX_OFFENSE' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ chargeCategory: "SEX_OFFENSE" });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredChargeCategories = filtered.map((f) => f.charge_category);
      });

      it("correctly returns charge_category items matching sex offense value", () => {
        const expected = ["SEX_OFFENSE", "SEX_OFFENSE"];
        expect(filteredChargeCategories).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredChargeCategories).not.toContain("ALL");
      });
    });
  });

  describe("levelOneSupervisionLocation filter", () => {
    let filteredSupervisionLocations = [];

    describe("with levelOneSupervisionLocation = 'ALL' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ levelOneSupervisionLocation: ["ALL"] });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredSupervisionLocations = filtered.map(
          (f) => f.level_1_supervision_location
        );
      });

      it("correctly returns level_1_supervision_location items matching the filter term", () => {
        const expected = ["ALL", "ALL"];
        expect(filteredSupervisionLocations).toEqual(expected);
      });
    });

    describe("with levelOneSupervisionLocation = '04B' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ levelOneSupervisionLocation: ["04B"] });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredSupervisionLocations = filtered.map(
          (f) => f.level_1_supervision_location
        );
      });

      it("correctly returns level_1_supervision_location items matching filter value", () => {
        const expected = ["04B"];
        expect(filteredSupervisionLocations).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredSupervisionLocations).not.toContain("ALL");
      });
    });

    // This is the case for the CaseTable because the
    // revocations_matrix_filtered_caseload endpoint has the following condition:
    // For US_PA the level_1_supervision_location (for now) is always ALL
    // For US_MO the level_1_supervision_location (for now) is never ALL
    // Therefore, continue to 'treatCategoryAllAsAbsent' for both of these cases
    describe("when the treatCategoryAllAsAbsent flag is true  and levelOneSupervisionLocation is ALL", () => {
      const treatCategoryAllAsAbsent = true;
      const categoryAllAbsentData = [
        {
          level_1_supervision_location: "01",
        },
        {
          level_1_supervision_location: "02",
        },
        {
          level_1_supervision_location: "03",
        },
        {
          level_1_supervision_location: "04",
        },
      ];

      beforeEach(() => {
        filters = observable.map({ levelOneSupervisionLocation: ["ALL"] });
        filtered = applyTopLevelFilters({
          filters,
          skippedFilters: [],
          treatCategoryAllAsAbsent,
        })(categoryAllAbsentData);
        filteredSupervisionLocations = filtered.map(
          (f) => f.level_1_supervision_location
        );
      });

      it("returns all of the rows", () => {
        const expected = ["01", "02", "03", "04"];
        expect(filteredSupervisionLocations).toEqual(expected);
      });
    });
  });

  describe("levelTwoSupervisionLocation filter", () => {
    let filteredSupervisionLocations = [];

    describe("with levelTwoSupervisionLocation = 'ALL' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ levelTwoSupervisionLocation: ["ALL"] });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredSupervisionLocations = filtered.map(
          (f) => f.level_2_supervision_location
        );
      });

      it("correctly returns level_2_supervision_location items matching the filter term", () => {
        const expected = ["ALL", "ALL"];
        expect(filteredSupervisionLocations).toEqual(expected);
      });
    });

    describe("with levelTwoSupervisionLocation = 'ROCKYROAD' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({
          levelTwoSupervisionLocation: ["ROCKYROAD"],
        });
        filtered = applyTopLevelFilters({ filters })(data);
        filteredSupervisionLocations = filtered.map(
          (f) => f.level_2_supervision_location
        );
      });

      it("correctly returns level_2_supervision_location items matching filter value", () => {
        const expected = ["ROCKYROAD"];
        expect(filteredSupervisionLocations).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredSupervisionLocations).not.toContain("ALL");
      });
    });

    // This is the case for the CaseTable because the
    // revocations_matrix_filtered_caseload endpoint has the following condition:
    // For US_PA the level_2_supervision_location (for now) is never ALL
    // For US_MO the level_2_supervision_location (for now) is always ALL
    // Therefore, continue to 'treatCategoryAllAsAbsent' for both of these cases
    describe("when the treatCategoryAllAsAbsent flag is true and levelTwoSupervisionLocation is ALL", () => {
      const treatCategoryAllAsAbsent = true;
      const categoryAllAbsentData = [
        {
          level_2_supervision_location: "01",
        },
        {
          level_2_supervision_location: "02",
        },
        {
          level_2_supervision_location: "03",
        },
        {
          level_2_supervision_location: "04",
        },
      ];

      beforeEach(() => {
        filters = observable.map({ levelTwoSupervisionLocation: ["ALL"] });
        filtered = applyTopLevelFilters({
          filters,
          skippedFilters: [],
          treatCategoryAllAsAbsent,
        })(categoryAllAbsentData);
        filteredSupervisionLocations = filtered.map(
          (f) => f.level_2_supervision_location
        );
      });

      it("returns all of the rows", () => {
        const expected = ["01", "02", "03", "04"];
        expect(filteredSupervisionLocations).toEqual(expected);
      });
    });
  });
});

describe("applyMatrixFilters", () => {
  let filters = observable.map({});
  let filtered = [];
  let data = [];

  beforeEach(() => {
    data = [
      {
        charge_category: "ALL",
        district: "ALL",
        month: "1",
        reported_violations: "1",
        state_code: "US_PA",
        supervision_level: "ALL",
        supervision_type: "ALL",
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
        violation_type: "LAW",
        year: "2020",
      },
      {
        charge_category: "ALL",
        district: "ALL",
        month: "1",
        reported_violations: "1",
        state_code: "US_PA",
        supervision_level: "MINIMUM",
        supervision_type: "PROBATION",
        total_revocations: "20",
        violation_type: "LAW",
        year: "2020",
      },
      {
        charge_category: "ALL",
        district: "ALL",
        month: "1",
        reported_violations: "ALL",
        state_code: "US_PA",
        supervision_level: "MINIMUM",
        supervision_type: "PROBATION",
        total_revocations: "20",
        violation_type: "ALL",
        year: "2020",
      },
    ];
  });

  describe("violationType filter", () => {
    let filteredViolationTypes = [];

    describe("with violationType = 'ALL' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ violationType: "All" });
        filtered = applyMatrixFilters(filters)(data);
        filteredViolationTypes = filtered.map((f) => f.violation_type);
      });

      it("returns the 'ALL' row", () => {
        const expected = ["ALL"];

        expect(filteredViolationTypes).toEqual(expected);
      });
    });

    describe("with violationType = 'MED_TECH' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ violationType: "MED_TECH" });
        filtered = applyMatrixFilters(filters)(data);
        filteredViolationTypes = filtered.map((f) => f.violation_type);
      });

      it("correctly returns all violation_type items matching the filter term", () => {
        const expected = ["MED_TECH", "MED_TECH"];

        expect(filteredViolationTypes).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredViolationTypes).not.toContain("ALL");
      });
    });

    describe("with violationType = 'LAW' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ violationType: "LAW" });
        filtered = applyMatrixFilters(filters)(data);
        filteredViolationTypes = filtered.map((f) => f.violation_type);
      });

      it("correctly returns supervision_level items matching the filter term", () => {
        const expected = ["LAW", "LAW"];

        expect(filteredViolationTypes).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredViolationTypes).not.toContain("ALL");
      });
    });

    describe("with violationType = 'BOGUS' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ violationType: "BOGUS" });
        filtered = applyMatrixFilters(filters)(data);
        filteredViolationTypes = filtered.map((f) => f.violationType);
      });

      it("returns an empty array and does not throw an error", () => {
        const expected = [];

        expect(filteredViolationTypes).toEqual(expected);
      });
    });
  });

  describe("reportedViolations filter", () => {
    let filteredReportedViolations = [];

    describe("with reportedViolations = 'ALL' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ reportedViolations: "ALL" });
        filtered = applyMatrixFilters(filters)(data);
        filteredReportedViolations = filtered.map((f) => f.reported_violations);
      });

      it("returns the 'ALL' row", () => {
        const expected = ["ALL"];

        expect(filteredReportedViolations).toEqual(expected);
      });
    });

    describe("with reportedViolations = '1' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ reportedViolations: "1" });
        filtered = applyMatrixFilters(filters)(data);
        filteredReportedViolations = filtered.map((f) => f.reported_violations);
      });

      it("correctly returns all reported_violations items matching the filter term", () => {
        const expected = ["1", "1", "1", "1"];

        expect(filteredReportedViolations).toEqual(expected);
      });

      it("does not double count the 'ALL' item", () => {
        expect(filteredReportedViolations).not.toContain("ALL");
      });
    });

    describe("with reportedViolations = 'BOGUS' filter applied", () => {
      beforeEach(() => {
        filters = observable.map({ reportedViolations: "BOGUS" });
        filtered = applyMatrixFilters(filters)(data);
        filteredReportedViolations = filtered.map((f) => f.reportedViolations);
      });

      it("returns an empty array and does not throw an error", () => {
        const expected = [];

        expect(filteredReportedViolations).toEqual(expected);
      });
    });
  });
});
