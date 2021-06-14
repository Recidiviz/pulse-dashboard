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
import * as lanternTenant from "../../../RootStore/TenantStore/lanternTenants";
import CaseTableStore from "../DataStore/CaseTableStore";
import { setTranslateLocale } from "../../../utils/i18nSettings";

describe("CaseTableStore", () => {
  let store;
  let tableData;
  let exportData;

  const mockLanternStore = {
    filters: new Map([["metricPeriodMonths", "12"]]),
  };

  describe("columns", () => {
    describe("when the tenant is US_MO", () => {
      beforeEach(() => {
        store = new CaseTableStore({
          rootStore: {
            ...mockLanternStore,
            currentTenantId: lanternTenant.US_MO,
          },
        });
      });
      it("formats columns for US_MO", () => {
        expect(store.columns.map((c) => c.label)).toEqual([
          "DOC ID",
          "District",
          "Officer",
          "Risk level",
          "Last Rec. (Incl. Supplementals)",
          "Violation record",
          "Total Admissions",
        ]);
      });
    });
    describe("when the tenant is US_PA", () => {
      beforeEach(() => {
        store = new CaseTableStore({
          rootStore: {
            ...mockLanternStore,
            currentTenantId: lanternTenant.US_PA,
          },
        });
      });
      it("formats columns for US_MO", () => {
        expect(store.columns.map((c) => c.label)).toEqual([
          "DOC ID",
          "District",
          "Agent",
          "Risk level",
          "Violation record",
          "All Recommitments",
        ]);
      });
    });
  });

  describe("formatTableData", () => {
    beforeEach(() => {
      setTranslateLocale(lanternTenant.US_MO);
      store = new CaseTableStore({
        rootStore: {
          ...mockLanternStore,
          currentTenantId: lanternTenant.US_MO,
        },
      });
      tableData = [
        {
          charge_category: "ALCOHOL_DRUG",
          district: "01",
          metric_period_months: "12",
          officer: "111222: FRED FLINSTONE",
          officer_recommendation: "ANY_NORMAL_RECOMMENDATION",
          reported_violations: "3",
          risk_level: "MEDIUM",
          state_code: "US_PA",
          state_id: "75XXX",
          supervision_level: "MEDIUM",
          supervision_type: "PAROLE",
          violation_record: "1fel;2low_tech",
          violation_type: "FELONY",
          admission_history_description:
            "LEGAL_REVOCATION;SHOCK_INCARCERATION_6_MONTHS",
        },
      ];
    });

    it("formats the officer id", () => {
      const result = store.formatTableData(tableData);
      expect(result[0].officer).toEqual("FRED FLINSTONE");
    });

    describe("when the tenant is US_MO", () => {
      beforeEach(() => {
        store = new CaseTableStore({
          rootStore: {
            ...mockLanternStore,
            currentTenantId: lanternTenant.US_MO,
          },
        });
      });
      it("formats the risk level for US_MO", () => {
        const result = store.formatTableData(tableData);
        expect(result[0].risk_level).toEqual("Moderate Risk");
      });

      it("includes the officer recommendation column", () => {
        const result = store.formatTableData(tableData);
        expect(result[0].officer_recommendation).toEqual(
          "Any Normal Recommendation"
        );
      });
    });

    describe("when the tenant is US_PA", () => {
      let result;
      beforeEach(() => {
        setTranslateLocale(lanternTenant.US_PA);
        store = new CaseTableStore({
          rootStore: {
            ...mockLanternStore,
            currentTenantId: lanternTenant.US_PA,
          },
        });
        result = store.formatTableData(tableData);
      });
      it("formats the risk level for US_PA", () => {
        expect(result[0].risk_level).toEqual("Medium Risk");
      });

      it("does not include officer recommendation", () => {
        expect(result[0]).not.toHaveProperty("officer_recommendation");
      });

      it("formats admission history description", () => {
        expect(result[0].admission_history_description).toEqual(
          "SCI 6 months, Revocation"
        );
      });
    });

    describe("officer recommendation", () => {
      it("when officer recommendation is DOC", () => {
        tableData[0].officer_recommendation = "PLACEMENT_IN_DOC_FACILITY";
        const result = store.formatTableData(tableData);
        const expected = "Placement In DOC Facility";
        expect(result[0].officer_recommendation).toEqual(expected);
      });

      it("when officer recommendation is CODS case", () => {
        tableData[0].officer_recommendation = "CODS";
        const result = store.formatTableData(tableData);
        const expected = "CODS";
        expect(result[0].officer_recommendation).toEqual(expected);
      });

      it("title cases everything else", () => {
        const result = store.formatTableData(tableData);
        const expected = "Any Normal Recommendation";
        expect(result[0].officer_recommendation).toEqual(expected);
      });
    });
  });

  describe("#formatExportData", () => {
    beforeEach(() => {
      exportData = [
        {
          charge_category: "ALCOHOL_DRUG",
          district: "01",
          metric_period_months: "12",
          officer: "111222: FRED FLINSTONE",
          officer_recommendation: "ANY_NORMAL_RECOMMENDATION",
          reported_violations: "3",
          risk_level: "MEDIUM",
          state_code: "US_PA",
          state_id: "75XXX",
          supervision_level: "MEDIUM",
          supervision_type: "PAROLE",
          violation_record: "1fel;2low_tech",
          violation_type: "FELONY",
        },
      ];
    });

    it("formats the data correctly for export", () => {
      setTranslateLocale(lanternTenant.US_MO);
      store = new CaseTableStore({
        rootStore: {
          ...mockLanternStore,
          currentTenantId: lanternTenant.US_MO,
        },
      });
      exportData[0].admission_history_description = "2";
      const result = store.formatExportData(exportData);
      const expected = [
        {
          data: [
            "75XXX",
            "01",
            "FRED FLINSTONE",
            "Moderate Risk",
            "1 fel",
            "2",
            "Any Normal Recommendation",
          ],
        },
      ];
      expect(result).toEqual(expected);
    });

    it("only only includes columns for the specific tenant", () => {
      setTranslateLocale(lanternTenant.US_PA);
      store = new CaseTableStore({
        rootStore: {
          ...mockLanternStore,
          currentTenantId: lanternTenant.US_PA,
        },
      });
      exportData[0].admission_history_description =
        "LEGAL_REVOCATION;SHOCK_INCARCERATION_0_TO_6_MONTHS";
      const result = store.formatExportData(exportData);
      const expected = [
        {
          data: [
            "75XXX",
            "01",
            "FRED FLINSTONE",
            "Medium Risk",
            "2 low_tech",
            "SCI < 6 months, Revocation",
          ],
        },
      ];
      expect(result).toEqual(expected);
    });
  });
});
