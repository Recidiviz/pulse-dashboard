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
import { compareViolationRecords } from "../../../../utils/charts/violationRecord";
import { nameFromOfficerId } from "../../../../utils/transforms/labels";

const RISK_LEVEL_PRIORITY = [
  "NOT_ASSESSED",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

const OFFICER_RECOMENDATION_PRIORITY = [
  "WARNING",
  "CONTINUATION",
  "CITATION",
  "REVOCATION",
];

function comparePersonExternalIds(a, b) {
  if (parseInt(a, 10) > parseInt(b, 10)) return 1;
  if (parseInt(a, 10) < parseInt(b, 10)) return -1;
  return 0;
}

function compareDistricts(a, b) {
  if (a.padStart(2, "0") > b.padStart(2, "0")) return 1;
  if (a.padStart(2, "0") < b.padStart(2, "0")) return -1;
  return 0;
}

function compareOfficers(a, b) {
  const aOfficer = nameFromOfficerId(a.officer || "");
  const bOfficer = nameFromOfficerId(b.officer || "");

  if (!aOfficer && bOfficer) return 1;
  if (!bOfficer && aOfficer) return -1;

  if (aOfficer.toLowerCase() > bOfficer.toLowerCase()) return 1;
  if (aOfficer.toLowerCase() < bOfficer.toLowerCase()) return -1;
  return 0;
}

function compareRiskLevel(a, b) {
  if (RISK_LEVEL_PRIORITY.indexOf(a) > RISK_LEVEL_PRIORITY.indexOf(b)) {
    return 1;
  }
  if (RISK_LEVEL_PRIORITY.indexOf(a) < RISK_LEVEL_PRIORITY.indexOf(b)) {
    return -1;
  }
  return 0;
}

function compareOffecerRecomendations(a, b) {
  if (
    OFFICER_RECOMENDATION_PRIORITY.indexOf(a) >
    OFFICER_RECOMENDATION_PRIORITY.indexOf(b)
  ) {
    return 1;
  }
  if (
    OFFICER_RECOMENDATION_PRIORITY.indexOf(a) <
    OFFICER_RECOMENDATION_PRIORITY.indexOf(b)
  ) {
    return -1;
  }
  return 0;
}

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

    return (
      (sort.field === "state_id" &&
        comparePersonExternalIds(a2.state_id, b2.state_id)) ||
      (sort.field === "district" &&
        compareDistricts(a2.district, b2.district)) ||
      (sort.field === "offecer" && compareDistricts(a2.officer, b2.officer)) ||
      (sort.field === "risk_level" &&
        compareRiskLevel(a2.risk_level, b2.risk_level)) ||
      (sort.field === "officer_recommendation" &&
        compareOffecerRecomendations(
          a2.officer_recommendation,
          b2.officer_recommendation
        )) ||
      (sort.field === "violation_record" &&
        compareViolationRecords(
          a2.violation_record,
          b2.violation_record,
          sort.order
        )) ||
      // default sorts
      compareDistricts(a2.district, b2.district) ||
      compareOfficers(a2.officer, b2.officer) ||
      comparePersonExternalIds(a2.state_id, b2.state_id) ||
      0
    );
  }

  return {
    comparator,
    getOrder,
    toggleOrder,
  };
}

export default useSort;
