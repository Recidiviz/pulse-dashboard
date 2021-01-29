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
// =======

import filterOptionsMap from "../filterOptions";

describe("filterOptionsMap", () => {
  let result;

  describe("district filter option", () => {
    it("is the same for both tenants", () => {
      result = filterOptionsMap;
      const expected = {
        defaultValue: "All",
      };

      expect(result.US_MO.district).toEqual(expected);
      expect(result.US_PA.district).toEqual(expected);
    });
  });

  describe("metricPeriodMonths filter option", () => {
    it("is the same for both tenants", () => {
      result = filterOptionsMap;
      const expected = {
        defaultOption: {
          label: "1 year",
          value: "12",
        },
        defaultValue: "12",
        options: [
          {
            label: "3 years",
            value: "36",
          },
          {
            label: "1 year",
            value: "12",
          },
          {
            label: "6 months",
            value: "6",
          },
          {
            label: "3 months",
            value: "3",
          },
          {
            label: "1 month",
            value: "1",
          },
        ],
      };

      expect(result.US_MO.metricPeriodMonths).toEqual(expected);
      expect(result.US_PA.metricPeriodMonths).toEqual(expected);
    });
  });

  describe("reportedViolations fiter option", () => {
    it("is the same for both tenants", () => {
      result = filterOptionsMap;
      const expected = {
        defaultValue: "All",
      };

      expect(result.US_MO.reportedViolations).toEqual(expected);
      expect(result.US_PA.reportedViolations).toEqual(expected);
    });
  });

  describe("when the stateCode is US_MO", () => {
    beforeAll(() => {
      result = filterOptionsMap.US_MO;
    });

    it("returns the correct filter admissionType option", () => {
      const expected = {
        defaultOption: [
          {
            label: "Revocation",
            value: "REVOCATION",
          },
        ],
        defaultValue: ["REVOCATION"],
        options: [
          {
            label: "ALL",
            value: "All",
          },
          {
            label: "Revocation",
            value: "REVOCATION",
          },
          {
            label: "Institutional Treatment",
            value: "INSTITUTIONAL TREATMENT",
          },
          {
            label: "Board Returns",
            value: "BOARDS_RETURN",
          },
        ],
        summingOption: {
          label: "ALL",
          value: "All",
        },
        componentEnabled: false,
        filterEnabled: false,
      };

      expect(result.admissionType).toEqual(expected);
    });

    it("returns the correct filter chargeCategory option", () => {
      const expected = {
        defaultOption: {
          label: "All",
          value: "All",
        },
        defaultValue: "All",
        options: [
          {
            label: "All",
            value: "All",
          },
          {
            label: "General",
            value: "GENERAL",
          },
          {
            label: "Sex Offense",
            value: "SEX_OFFENSE",
          },
          {
            label: "Domestic Violence",
            value: "DOMESTIC_VIOLENCE",
          },
          {
            label: "Serious Mental Illness",
            value: "SERIOUS_MENTAL_ILLNESS",
          },
        ],
      };

      expect(result.chargeCategory).toEqual(expected);
    });

    it("returns the correct filter supervisionType option", () => {
      const expected = {
        componentEnabled: true,
        defaultOption: {
          label: "All",
          value: "All",
        },
        defaultValue: "All",
        options: [
          {
            label: "All",
            value: "All",
          },
          {
            label: "Probation",
            value: "PROBATION",
          },
          {
            label: "Parole",
            value: "PAROLE",
          },
          {
            label: "Dual Supervision",
            value: "DUAL",
          },
        ],
      };

      expect(result.supervisionType).toEqual(expected);
    });

    it("returns the correct filter violationType option", () => {
      const expected = {
        defaultValue: "All",
        options: [
          {
            key: "travel_count",
            label: "Travel",
            type: "TECHNICAL",
          },
          {
            key: "residency_count",
            label: "Residency",
            type: "TECHNICAL",
          },
          {
            key: "employment_count",
            label: "Employment",
            type: "TECHNICAL",
          },
          {
            key: "association_count",
            label: "Association",
            type: "TECHNICAL",
          },
          {
            key: "directive_count",
            label: "Report / Directives",
            type: "TECHNICAL",
          },
          {
            key: "supervision_strategy_count",
            label: "Supervision Strategies",
            type: "TECHNICAL",
          },
          {
            key: "intervention_fee_count",
            label: "Intervention Fees",
            type: "TECHNICAL",
          },
          {
            key: "special_count",
            label: "Special Conditions",
            type: "TECHNICAL",
          },
          {
            key: "weapon_count",
            label: "Weapons",
            type: "TECHNICAL",
          },
          {
            key: "substance_count",
            label: "Substance Use",
            type: "TECHNICAL",
          },
          {
            key: "municipal_count",
            label: "Municipal",
            type: "LAW",
          },
          {
            key: "absconded_count",
            label: "Absconsion",
            type: "TECHNICAL",
          },
          {
            key: "misdemeanor_count",
            label: "Misdemeanor",
            type: "LAW",
          },
          {
            key: "felony_count",
            label: "Felony",
            type: "LAW",
          },
        ],
      };

      expect(result.violationType).toEqual(expected);
    });

    it("returns the correct supervisionLevel filter options", () => {
      const expected = {
        componentEnabled: false,
        defaultOption: {
          label: "All",
          value: "All",
        },
        defaultValue: "All",
        options: [
          {
            label: "All",
            value: "All",
          },
          {
            label: "Enhanced Supervision",
            value: "ENHANCED",
          },
          {
            label: "Maximum Supervision",
            value: "MAXIMUM",
          },
          {
            label: "Medium Supervision",
            value: "MEDIUM",
          },
          {
            label: "Minimum Supervision",
            value: "MINIMUM",
          },
          {
            label: "Special Circumstance Supervision",
            value: "SPECIAL",
          },
          {
            label: "Monitored Supervision",
            value: "ELECTRONIC_MONITORING_ONLY",
          },
        ],
      };

      expect(result.supervisionLevel).toEqual(expected);
    });
  });

  describe("when the stateCode is US_PA", () => {
    beforeAll(() => {
      result = filterOptionsMap.US_PA;
    });

    it("returns the correct admissionType filter options", () => {
      const expected = {
        defaultOption: [
          {
            label: "Revocation",
            value: "REVOCATION",
          },
        ],
        defaultValue: ["REVOCATION"],
        options: [
          {
            label: "ALL",
            value: "All",
          },
          {
            label: "Revocation",
            value: "REVOCATION",
          },
          {
            allSelectedLabel: "All Short Term",
            label: "SCI",
            options: [
              {
                label: "SCI 6 months",
                value: "SCI_6",
              },
              {
                label: "SCI 9 months",
                value: "SCI_9",
              },
              {
                label: "SCI 12 months",
                value: "SCI_12",
              },
            ],
          },
          {
            label: "PVC",
            value: "PVC",
          },
          {
            label: "Inpatient D&A",
            value: "INPATIENT_DA",
          },
          {
            label: "D&A Detox",
            value: "DA_DETOX",
          },
          {
            label: "Mental Health",
            value: "MENTAL_HEALTH",
          },
        ],
        summingOption: {
          label: "ALL",
          value: "All",
        },
        componentEnabled: false,
        filterEnabled: false,
      };

      expect(result.admissionType).toEqual(expected);
    });

    it("returns the correct chargeCategory filter options", () => {
      const expected = {
        defaultOption: {
          label: "All",
          value: "All",
        },
        defaultValue: "All",
        options: [
          {
            label: "All",
            value: "All",
          },
          {
            label: "General",
            value: "GENERAL",
          },
          {
            label: "Sex Offense",
            value: "SEX_OFFENSE",
          },
          {
            label: "Domestic Violence",
            value: "DOMESTIC_VIOLENCE",
          },
          {
            label: "Mental Health",
            value: "SERIOUS_MENTAL_ILLNESS",
          },
          {
            label: "AOD",
            value: "ALCOHOL_DRUG",
          },
        ],
      };

      expect(result.chargeCategory).toEqual(expected);
    });

    it("returns the correct supervisionType filter options", () => {
      const expected = {
        componentEnabled: false,
        defaultValue: "All",
      };

      expect(result.supervisionType).toEqual(expected);
    });

    it("returns the correct violationType filter options", () => {
      const expected = {
        defaultValue: "All",
        options: [
          {
            key: "low_tech_count",
            label: "Low tech.",
            type: "TECHNICAL",
          },
          {
            key: "med_tech_count",
            label: "Med tech.",
            type: "TECHNICAL",
          },
          {
            key: "elec_monitoring_count",
            label: "Elec. monitoring",
            type: "TECHNICAL",
          },
          {
            key: "substance_count",
            label: "Subs. use",
            type: "TECHNICAL",
          },
          {
            key: "absconded_count",
            label: "Absconsion",
            type: "TECHNICAL",
          },
          {
            key: "high_tech_count",
            label: "High tech.",
            type: "TECHNICAL",
          },
          {
            key: "law_count",
            label: "Law",
            type: "LAW",
          },
        ],
      };

      expect(result.violationType).toEqual(expected);
    });

    it("returns the correct supervisionLevel filter options", () => {
      const expected = {
        componentEnabled: true,
        defaultOption: {
          label: "All",
          value: "All",
        },
        defaultValue: "All",
        options: [
          {
            label: "All",
            value: "All",
          },
          {
            label: "Enhanced Supervision",
            value: "ENHANCED",
          },
          {
            label: "Maximum Supervision",
            value: "MAXIMUM",
          },
          {
            label: "Medium Supervision",
            value: "MEDIUM",
          },
          {
            label: "Minimum Supervision",
            value: "MINIMUM",
          },
          {
            label: "Special Circumstance Supervision",
            value: "SPECIAL",
          },
          {
            label: "Monitored Supervision",
            value: "ELECTRONIC_MONITORING_ONLY",
          },
        ],
      };

      expect(result.supervisionLevel).toEqual(expected);
    });
  });
});
