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

import * as lantern from "./utils/lanternConstants";
import * as core from "./utils/coreConstants";

export default {
  [lantern.MO]: {
    "name": "Missouri",
    "availableStateCodes": [lantern.MO],
    "regions": {
      "Western Region": ["1", "4", "4C", "WN", "4W", "19", "24"],
      "North Central Region": ["2", "5", "6", "20", "27", "29", "32", "XCRC", "MCC", "MTC", "WMCC", "WRDCC"],
      "Southwest Region": ["9", "10", "10N", "10R", "13", "21", "30", "33", "42", "43", "44", "ATC", "CTCC", "FRDC", "JCCC", "OCC", "SCCC", "OCC"],
      "Northeast Region": ["3", "11", "16", "17", "18", "26", "38", "BCC", "CCC", "NECC", "WERDCC"],
      "Eastern Region": ["7B", "7C", "7S", "8C", "8E", "8N", "8S", "EP", "ERV", "TCSTL"],
      "Southeast Region": ["12", "14", "15", "22", "23", "25", "31", "36", "37", "ERDCC", "FCC", "MECC", "PCC", "SECC"]
    }
  },
  [core.ND]: {
    "name": "North Dakota",
    "availableStateCodes": [core.ND]
  },
  [lantern.PA]: {
    "name": "Pennsylvania",
    "availableStateCodes": [lantern.PA]
  },
  "recidiviz": {
    "name": "Recidiviz",
    "availableStateCodes": lantern.LANTERN_STATES.concat(core.CORE_STATES)
  },
  "lantern": {
    "name": "Lantern",
    "availableStateCodes": lantern.LANTERN_STATES
  }
}
