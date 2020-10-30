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

import { initI18n, setTranslateLocale, translate, i18n } from "../i18nSettings";

describe("i18nSettings", () => {
  beforeEach(() => {
    initI18n();
  });

  describe("setTranslateLocale", () => {
    describe("when the locale is known", () => {
      it("does not throw an error for us_pa", () => {
        expect(() => setTranslateLocale("us_pa")).not.toThrow();
      });

      it("does not throw an error for us_mo", () => {
        expect(() => setTranslateLocale("us_mo")).not.toThrow();
      });
    });

    describe("when the locale is unknown", () => {
      it("does not throw an error", () => {
        expect(() => setTranslateLocale("zz_top")).not.toThrow();
      });
    });
  });

  describe("translate", () => {
    describe("when translate locale is us_mo", () => {
      beforeAll(() => {
        setTranslateLocale("us_mo");
      });

      it("translates a known term", () => {
        expect(translate("percentRevoked")).toEqual("Percent revoked");
      });

      it("passes through an unknown term", () => {
        expect(translate("dazzle")).toEqual("dazzle");
      });
    });

    describe("when translate locale is us_pa", () => {
      beforeAll(() => {
        setTranslateLocale("us_pa");
      });

      it("translates a known term", () => {
        expect(translate("percentRevoked")).toEqual("Admission rate");
      });

      it("passes through an unknown term", () => {
        expect(translate("dazzle")).toEqual("dazzle");
      });
    });

    describe("when translate locale has not yet been set", () => {
      it("does not throw an error", () => {
        expect(() => translate("percentRevoked")).not.toThrow();
      });

      it("defaults to us_pa locale", () => {
        expect(i18n.getLocale()).toEqual("us_pa");
      });
    });
  });
});
