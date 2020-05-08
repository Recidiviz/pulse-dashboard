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
import { violationRecordComparator } from "../../../../utils/charts/violationRecord";

const RISK_LEVEL_PRIORITY = [
  "NOT_ASSESSED",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

const OFFICER_RECOMENDATION_PRIORITY = [
  "CITATION",
  "CONTINUATION",
  "REVOCATION",
  "WARNING",
];

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

    // Sort by district, with undefined districts to the bottom
    if (!a2.district && b2.district) return 1;
    if (!b2.district && a2.district) return -1;

    if (sort.order) {
      // Sort by person external id
      if (sort.field === "state_id") {
        if (parseInt(a2.state_id, 10) > parseInt(b2.state_id, 10)) return 1;
        if (parseInt(a2.state_id, 10) < parseInt(b2.state_id, 10)) return -1;
      }

      // Sort by district
      if (sort.field === "district") {
        if (a2.district.padStart(2, "0") > b2.district.padStart(2, "0"))
          return 1;
        if (a2.district.padStart(2, "0") < b2.district.padStart(2, "0"))
          return -1;
      }

      // Sort by officer
      if (sort.field === "officer") {
        if (aOfficer.toLowerCase() > bOfficer.toLowerCase()) return 1;
        if (aOfficer.toLowerCase() < bOfficer.toLowerCase()) return -1;
      }

      // Sort by risk level
      if (sort.field === "risk_level") {
        if (
          RISK_LEVEL_PRIORITY.indexOf(a2.risk_level) >
          RISK_LEVEL_PRIORITY.indexOf(b2.risk_level)
        )
          return 1;
        if (
          RISK_LEVEL_PRIORITY.indexOf(a2.risk_level) <
          RISK_LEVEL_PRIORITY.indexOf(b2.risk_level)
        )
          return -1;
      }

      // Sort by officer recommendation
      if (sort.field === "officer_recommendation") {
        if (
          OFFICER_RECOMENDATION_PRIORITY.indexOf(a2.officer_recommendation) >
          OFFICER_RECOMENDATION_PRIORITY.indexOf(b2.officer_recommendation)
        )
          return 1;
        if (
          OFFICER_RECOMENDATION_PRIORITY.indexOf(a2.officer_recommendation) <
          OFFICER_RECOMENDATION_PRIORITY.indexOf(b2.officer_recommendation)
        )
          return -1;
      }

      if (sort.field === "violation_record") {
        const result = violationRecordComparator(
          a2.violation_record,
          b2.violation_record
        );
        if (result !== 0) return result;
      }
    }

    return 0;
  }

  return {
    comparator,
    getOrder,
    toggleOrder,
  };
}

export default useSort;
