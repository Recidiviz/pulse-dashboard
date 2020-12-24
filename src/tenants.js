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

import * as lantern from "./views/tenants/utils/lanternTenants";
import * as core from "./views/tenants/utils/coreTenants";

export default {
  // prettier-ignore
  [lantern.MO]: {
    name: "Missouri",
    availableStateCodes: [lantern.MO],
  },
  [core.ND]: {
    name: "North Dakota",
    availableStateCodes: [core.ND],
  },
  [lantern.PA]: {
    name: "Pennsylvania",
    availableStateCodes: [lantern.PA],
  },
  recidiviz: {
    name: "Recidiviz",
    availableStateCodes: lantern.LANTERN_STATES.concat(core.CORE_STATES),
  },
  lantern: {
    name: "Lantern",
    availableStateCodes: lantern.LANTERN_STATES,
  },
};
