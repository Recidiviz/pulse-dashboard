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

import {
  dimensionManifestIncludesFilterValues,
  getQueryStringFromFilters,
} from "../DataStore/helpers";

describe("DataStore helpers", () => {
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
      filters = { ...filters, supervisionLevel: "", supervisionType: "All" };
      expect(getQueryStringFromFilters(filters)).toEqual(
        "?district[0]=All&chargeCategory=GENERAL&supervisionType=All"
      );
    });
  });

  describe("dimensionManifestIncludesFilterValues", () => {
    let filters;
    let dimensionManifest;
    let skippedFilters;
    let ignoredSubsetDimensions;
    let treatCategoryAllAsAbsent;

    it("returns true when the dimension manifest has all the filter values", () => {
      filters = {
        chargeCategory: "All",
        violationType: "All",
        metricPeriodMonths: "12",
      };

      dimensionManifest = {
        chargeCategory: ["all", "domestic_violence", "general"],
        violationType: ["all", "absconded", "escaped", "felony"],
        metricPeriodMonths: ["1", "12", "3", "36", "6"],
      };
      expect(
        dimensionManifestIncludesFilterValues({ filters, dimensionManifest })
      ).toEqual(true);
    });

    it("returns false when the dimension manifest is missing the filter value", () => {
      filters = {
        chargeCategory: "All",
        violationType: "LAW",
        metricPeriodMonths: "12",
      };

      dimensionManifest = {
        chargeCategory: ["all", "domestic_violence", "general"],
        violationType: ["absconded", "escaped", "felony"],
        metricPeriodMonths: ["1", "12", "3", "36", "6"],
      };
      expect(
        dimensionManifestIncludesFilterValues({ filters, dimensionManifest })
      ).toEqual(false);
    });

    describe("when there are skipped filters", () => {
      beforeEach(() => {
        filters = {
          chargeCategory: "All",
          violationType: "All",
          metricPeriodMonths: "9",
        };

        dimensionManifest = {
          chargeCategory: ["all", "domestic_violence", "general"],
          violationType: ["all", "absconded", "escaped", "felony"],
          metricPeriodMonths: ["1", "12", "3", "36", "6"],
        };

        skippedFilters = ["metricPeriodMonths"];
      });

      it("ignores that filter type when all other values match the dimension manifest", () => {
        expect(
          dimensionManifestIncludesFilterValues({
            filters,
            dimensionManifest,
            skippedFilters,
          })
        ).toEqual(true);
      });

      it("only ignores the skipped filter type", () => {
        filters.violationType = "LAW";
        expect(
          dimensionManifestIncludesFilterValues({
            filters,
            dimensionManifest,
            skippedFilters,
          })
        ).toEqual(false);
      });
    });

    describe("when there are ignored subset dimensions", () => {
      it("ignores that filter type when all other values match the dimension manifest", () => {
        filters = {
          chargeCategory: "All",
          violationType: "All",
          metricPeriodMonths: "12",
          admissionType: "01",
        };

        dimensionManifest = {
          admissionType: ["all", "02"],
          chargeCategory: ["all", "domestic_violence", "general"],
          violationType: ["all", "absconded", "escaped", "felony"],
          metricPeriodMonths: ["1", "12", "3", "36", "6"],
        };

        ignoredSubsetDimensions = ["admissionType"];
        expect(
          dimensionManifestIncludesFilterValues({
            filters,
            dimensionManifest,
            ignoredSubsetDimensions,
          })
        ).toEqual(true);
      });
    });

    describe("when the 'All' filter value should be ignored", () => {
      it("ignores that filter type when all other values match the dimension manifest", () => {
        filters = {
          chargeCategory: "All",
          violationType: "ABSCONDED",
          metricPeriodMonths: "12",
        };

        dimensionManifest = {
          chargeCategory: ["domestic_violence", "general"],
          violationType: ["absconded", "escaped", "felony"],
          metricPeriodMonths: ["1", "12", "3", "36", "6"],
        };

        treatCategoryAllAsAbsent = true;
        expect(
          dimensionManifestIncludesFilterValues({
            filters,
            dimensionManifest,
            treatCategoryAllAsAbsent,
          })
        ).toEqual(true);
      });
    });
  });
});
