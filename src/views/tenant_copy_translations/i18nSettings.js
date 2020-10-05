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

import { I18n } from "i18n";

import tenants from "./tenants";

export const i18n = new I18n();

export function initI18n() {
  i18n.configure({
    staticCatalog: {
      us_mo: tenants.MO,
      us_pa: tenants.PA,
    }
  })
}

export function setTranslateLocale(tenant) {
  i18n.setLocale(tenant)
}

export function translate(term) {
  return i18n.__(term)
}
