// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import find from "lodash/fp/find";
import get from "lodash/fp/get";
import pipe from "lodash/fp/pipe";

import {
  ADMISSION_TYPES,
  SUPERVISION_LEVELS,
} from "../RootStore/TenantStore/filterOptions";
import { humanReadableTitleCase } from "./formatStrings";
import { translate } from "./i18nSettings";

const getLabelsString = (nestedFilterOptions, flattenedOptions) =>
  nestedFilterOptions
    .map((option) => {
      return pipe(find({ value: option }), get("label"))(flattenedOptions);
    })
    .join(", ");

function formatMetricPeriodMonthsFilter(metricPeriodMonths) {
  switch (metricPeriodMonths) {
    case "1":
      return "1 month";
    case "3":
      return "3 months";
    case "6":
      return "6 months";
    case "12":
      return "1 year";
    case "36":
      return "3 years";
    default:
      return "1 month";
  }
}

const formatDistrict = (district) =>
  district === "All" ? "All districts" : `District: ${district}`;

const formatChargeCategory = (chargeCategory) =>
  chargeCategory === "All"
    ? "All case types"
    : `Case type: ${humanReadableTitleCase(chargeCategory)}`;

const formatSupervisionType = (supervisionType) =>
  supervisionType === "All"
    ? "All supervision types"
    : `Supervision type: ${humanReadableTitleCase(supervisionType)}`;

const formatSupervisionLevel = (supervisionLevel) =>
  supervisionLevel === "All"
    ? "All supervision levels"
    : `Supervision level: ${pipe(
        find({ value: supervisionLevel }),
        get("label")
      )(SUPERVISION_LEVELS.options)}`;

const formatAdmissionType = (admissionTypes) => {
  return admissionTypes[0] === "All"
    ? `All ${translate("admission")} types`
    : `${translate("Admission")} type: ${getLabelsString(
        admissionTypes,
        ADMISSION_TYPES.flattenedOptions
      )}`;
};

function getFilters(toggleStates) {
  const filters = [];

  if (toggleStates.metricPeriodMonths) {
    filters.push(
      formatMetricPeriodMonthsFilter(toggleStates.metricPeriodMonths)
    );
  }

  if (toggleStates.district) {
    filters.push(formatDistrict(toggleStates.district));
  }

  if (toggleStates.chargeCategory) {
    filters.push(formatChargeCategory(toggleStates.chargeCategory));
  }

  if (toggleStates.supervisionType) {
    filters.push(formatSupervisionType(toggleStates.supervisionType));
  }

  if (toggleStates.supervisionLevel) {
    filters.push(formatSupervisionLevel(toggleStates.supervisionLevel));
  }

  if (toggleStates.admissionType) {
    filters.push(formatAdmissionType(toggleStates.admissionType));
  }

  return filters.join(", ");
}

export default getFilters;
