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

import { useState } from "react";
import { nameFromOfficerId } from "../../../../utils/transforms/labels";

const riskLevelPriority = {
  NOT_ASSESSED: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

function useSort() {
  const [sort, setSort] = useState({});

  function getOrder(field) {
    return sort.field === field ? sort.order : null;
  }

  function getNextOrder(order) {
    switch (order) {
      case "asc":
        return "desc";
      case "desc":
        return null;
      default:
        return "asc";
    }
  }

  function toggleOrder(field) {
    if (sort.field === field) {
      const order = getNextOrder(sort.order);
      if (!order) {
        setSort({});
      } else {
        setSort({ ...sort, order });
      }
    } else {
      setSort({ field, order: "asc" });
    }
  }

  function comparator(a1, b1) {
    const [a2, b2] = sort.order === "desc" ? [b1, a1] : [a1, b1];

    const aOfficer = nameFromOfficerId(a2.officer || "");
    const bOfficer = nameFromOfficerId(b2.officer || "");

    // Sort by officer, with undefined officers to the bottom
    if (!aOfficer && bOfficer) return 1;
    if (!bOfficer && aOfficer) return -1;

    if (sort.field === "officer") {
      if (aOfficer.toLowerCase() > bOfficer.toLowerCase()) return 1;
      if (aOfficer.toLowerCase() < bOfficer.toLowerCase()) return -1;
    }

    if (sort.field === "risk_level") {
      if (riskLevelPriority[a2.risk_level] > riskLevelPriority[b2.risk_level])
        return 1;
      if (riskLevelPriority[a2.risk_level] < riskLevelPriority[b2.risk_level])
        return -1;
    }

    // Sort by district, with undefined districts to the bottom
    if (!a2.district && b2.district) return 1;
    if (!b2.district && a2.district) return -1;

    if (String(a2.district) > String(b2.district)) return 1;
    if (String(a2.district) < String(b2.district)) return -1;

    // Sort by person external id
    if (String(a2.state_id) > String(b2.state_id)) return 1;
    if (String(a2.state_id) < String(b2.state_id)) return -1;

    return 0;
  }

  return {
    comparator,
    getOrder,
    toggleOrder,
  };
}

export default useSort;
