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
import * as helpers from "../helpers";
import { setTranslateLocale } from "../../../../../views/tenants/utils/i18nSettings";
import * as lanternTenant from "../../../../../views/tenants/utils/lanternTenants";

describe("helper", () => {
  let data;

  describe("#formatData", () => {
    beforeEach(() => {
      setTranslateLocale(lanternTenant.MO);
      data = {
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
      };
    });

    it("formats the officer id", () => {
      const result = helpers.formatData([data]);
      expect(result[0].officer).toEqual("FRED FLINSTONE");
    });

    describe("when the tenant is MO", () => {
      it("formats the risk level for MO", () => {
        setTranslateLocale(lanternTenant.MO);
        const result = helpers.formatData([data]);
        expect(result[0].risk_level).toEqual("Moderate Risk");
      });
    });

    describe("when the tenant is PA", () => {
      it("formats the risk level for PA", () => {
        setTranslateLocale(lanternTenant.PA);
        const result = helpers.formatData([data]);
        expect(result[0].risk_level).toEqual("Medium Risk");
      });
    });

    describe("officer recommendation", () => {
      it("when officer recommendation is DOC", () => {
        data.officer_recommendation = "PLACEMENT_IN_DOC_FACILITY";
        const result = helpers.formatData([data]);
        const expected = "Placement In DOC Facility";
        expect(result[0].officer_recommendation).toEqual(expected);
      });

      it("when officer recommendation is CODS case", () => {
        data.officer_recommendation = "CODS";
        const result = helpers.formatData([data]);
        const expected = "CODS";
        expect(result[0].officer_recommendation).toEqual(expected);
      });

      it("title cases everything else", () => {
        const result = helpers.formatData([data]);
        const expected = "Any Normal Recommendation";
        expect(result[0].officer_recommendation).toEqual(expected);
      });
    });
  });

  describe("#formatExportData", () => {
    beforeEach(() => {
      data = {
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
      };
    });

    it("formats the data correctly for export", () => {
      const result = helpers.formatExportData([data]);
      const expected = [
        {
          data: [
            "75XXX",
            "01",
            "FRED FLINSTONE",
            "Moderate Risk",
            "Any Normal Recommendation",
            "1 fel, 2 low_tech",
          ],
        },
      ];
      expect(result).toEqual(expected);
    });
  });
});
