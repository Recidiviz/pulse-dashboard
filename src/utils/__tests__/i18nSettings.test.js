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

import { i18n, initI18n, setTranslateLocale, translate } from "../i18nSettings";

describe("i18nSettings", () => {
  beforeEach(() => {
    initI18n();
  });

  describe("setTranslateLocale", () => {
    describe("when the locale is known", () => {
      it("does not throw an error for US_PA", () => {
        expect(() => setTranslateLocale("US_PA")).not.toThrow();
      });

      it("does not throw an error for US_MO", () => {
        expect(() => setTranslateLocale("US_MO")).not.toThrow();
      });
    });

    describe("when the locale is unknown", () => {
      it("does not throw an error", () => {
        expect(() => setTranslateLocale("zz_top")).not.toThrow();
      });
    });
  });

  describe("translate", () => {
    describe("when translate locale is US_MO", () => {
      beforeAll(() => {
        setTranslateLocale("US_MO");
      });

      it("translates a known term", () => {
        expect(translate("violationReports")).toEqual(
          "violation reports and notices of citation"
        );
      });

      it("passes through an unknown term", () => {
        expect(translate("dazzle")).toEqual("dazzle");
      });
    });

    describe("when translate locale is US_PA", () => {
      beforeAll(() => {
        setTranslateLocale("US_PA");
      });

      it("translates a known term", () => {
        expect(translate("violationReports")).toEqual("violation reports");
      });

      it("passes through an unknown term", () => {
        expect(translate("dazzle")).toEqual("dazzle");
      });
    });

    describe("when translate locale has not yet been set", () => {
      it("does not throw an error", () => {
        expect(() => translate("percentRevoked")).not.toThrow();
      });

      it("defaults to US_PA locale", () => {
        expect(i18n.getLocale()).toEqual("US_PA");
      });
    });
  });
});
