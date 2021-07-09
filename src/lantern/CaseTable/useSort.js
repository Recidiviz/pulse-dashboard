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

import { useCallback, useState } from "react";

import getNameFromOfficerId from "../utils/getNameFromOfficerId";
import { compareViolationRecords } from "./utils/compareViolationRecords";

const RISK_LEVEL_PRIORITY = [
  "NOT_ASSESSED",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

function comparePersonExternalIds(a, b) {
  if (!a && b) return 1;
  if (a && !b) return -1;

  if (String(a) > String(b)) return 1;
  if (String(a) < String(b)) return -1;

  return 0;
}

function compareOfficers(a, b) {
  const aOfficer = getNameFromOfficerId(a);
  const bOfficer = getNameFromOfficerId(b);

  if (!aOfficer && bOfficer) return 1;
  if (!bOfficer && aOfficer) return -1;

  if (aOfficer.toLowerCase() > bOfficer.toLowerCase()) return 1;
  if (aOfficer.toLowerCase() < bOfficer.toLowerCase()) return -1;

  return 0;
}

function compareRiskLevel(a, b) {
  return RISK_LEVEL_PRIORITY.indexOf(a) - RISK_LEVEL_PRIORITY.indexOf(b);
}

function compareStrings(a, b) {
  if (!a && b) return 1;
  if (!b && a) return -1;

  if (String(a) > String(b)) return 1;
  if (String(a) < String(b)) return -1;

  return 0;
}

function compareAdmissionHistoryDescriptions(formatAdmissionHistory) {
  return (a, b) => {
    if (Number.isNaN(Number(a)) || Number.isNaN(Number(b))) {
      const aFormattedHistory = formatAdmissionHistory(a);
      const bFormattedHistory = formatAdmissionHistory(b);

      const aTotalAdmissions = aFormattedHistory.split(",").length;
      const bTotalAdmissions = bFormattedHistory.split(",").length;

      if (aTotalAdmissions > bTotalAdmissions) return 1;
      if (aTotalAdmissions < bTotalAdmissions) return -1;
      if (aTotalAdmissions === bTotalAdmissions)
        return compareStrings(aFormattedHistory, bFormattedHistory);
      return 0;
    }
    return compareStrings(a, b);
  };
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

function useSort(formatAdmissionHistory) {
  const [sort, setSort] = useState({
    field: null,
    order: null,
  });

  function toggleOrder(field) {
    if (sort.field === field) {
      const order = getNextOrder(sort.order);
      if (order) {
        setSort({ field, order });
      } else {
        setSort({ field: null, order: null });
      }
    } else {
      setSort({ field, order: "asc" });
    }
  }

  const comparator = useCallback(
    (a1, b1) => {
      const [a2, b2] = sort.order === "desc" ? [b1, a1] : [a1, b1];

      const fieldComparator = {
        state_id: comparePersonExternalIds,
        district: compareStrings,
        officer: compareOfficers,
        risk_level: compareRiskLevel,
        officer_recommendation: compareStrings,
        violation_record: compareViolationRecords,
        admission_history_description: compareAdmissionHistoryDescriptions(
          formatAdmissionHistory
        ),
      }[sort.field];

      return (
        (fieldComparator && fieldComparator(a2[sort.field], b2[sort.field])) ||
        // default sorts
        compareStrings(a2.district, b2.district) ||
        compareOfficers(a2.officer, b2.officer) ||
        comparePersonExternalIds(a2.state_id, b2.state_id) ||
        0
      );
    },
    [sort.order, sort.field, formatAdmissionHistory]
  );

  return {
    sortOrder: sort.order,
    sortField: sort.field,
    comparator,
    toggleOrder,
  };
}

export default useSort;
