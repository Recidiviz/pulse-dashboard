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

import React from "react";

import { humanReadableTitleCase } from "../../../utils/transforms/labels";
import { parseAndFormatViolationRecord } from "./violationRecord";
import getNameFromOfficerId from "../../utils/getNameFromOfficerId";
import { translate } from "../../../utils/i18nSettings";
import { COLORS } from "../../../assets/scripts/constants/colors";

const nullSafeLabel = (label) => label || "Unknown";

export const normalizeOfficerRecommendation = (value) => {
  switch (value) {
    case "CODS":
      return value;
    case "PLACEMENT_IN_DOC_FACILITY":
      return "Placement In DOC Facility";
    default:
      return value ? humanReadableTitleCase(value) : "";
  }
};

export const formatData = (data) => {
  return data.map((record) => ({
    state_id: nullSafeLabel(record.state_id),
    district: nullSafeLabel(record.district),
    officer: nullSafeLabel(getNameFromOfficerId(record.officer)),
    risk_level: nullSafeLabel(translate("riskLevelsMap")[record.risk_level]),
    officer_recommendation: nullSafeLabel(
      normalizeOfficerRecommendation(record.officer_recommendation)
    ),
    violation_record: nullSafeLabel(
      parseAndFormatViolationRecord(record.violation_record)
    ),
    // Added because this is the only unique field in fake data
    admissionType: nullSafeLabel(record.admission_type),
  }));
};

export const formatExportData = (data) => {
  return (formatData(data) || []).map(({ admissionType, ...record }) => ({
    data: Object.values(record),
  }));
};

export const nullSafeCell = (label) => {
  if (label) {
    return <td>{label}</td>;
  }

  const unknownStyle = {
    fontStyle: "italic",
    fontSize: "13px",
    color: COLORS["grey-500"],
  };
  return <td style={unknownStyle}>{label}</td>;
};
