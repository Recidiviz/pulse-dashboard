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

import React from "react";
import { Link } from "react-router-dom";
import { ENTITY_TYPES, VitalsSummaryRecord } from "../models/types";
import { toTitleCase } from "../../utils/formatStrings";
import { convertIdToSlug } from "../../utils/navigation";
import "./VitalsSummaryBreadcrumbs.scss";

function formatOfficeName(name: string | undefined): string | undefined {
  if (!name) return "Unknown";
  return name.includes("Office") ? name : `${toTitleCase(name)} Office`;
}

function formatOfficerName(name: string): string {
  const nameWithoutId = name.split(": ").pop();
  return nameWithoutId || name;
}

type PropTypes = {
  stateName: string;
  entity: VitalsSummaryRecord;
  parentEntityName?: string;
};

const VitalsSummaryBreadcrumbs: React.FC<PropTypes> = ({
  stateName,
  entity,
  parentEntityName,
}) => {
  const { entityName, entityType, parentEntityId } = entity;
  let current;
  let state;
  let parent;

  switch (entityType) {
    case ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION:
      current = formatOfficeName(entityName);
      state = stateName;
      parent = undefined;
      break;
    case ENTITY_TYPES.PO:
      current = formatOfficerName(entityName);
      state = stateName;
      parent = formatOfficeName(parentEntityName);
      break;
    default:
      current = stateName;
      state = undefined;
      parent = undefined;
  }

  return (
    <div className="VitalsSummaryBreadcrumbs">
      <Link className="VitalsSummaryBreadcrumbs--state" to="/community/vitals">
        {state}
      </Link>
      {parent && (
        <div className="VitalsSummaryBreadcrumbs__parent-container">
          <span>/</span>
          <Link
            className="VitalsSummaryBreadcrumbs--parent"
            to={`/community/vitals/${convertIdToSlug(parentEntityId)}`}
          >
            {parent}
          </Link>
        </div>
      )}
      <div className="VitalsSummaryBreadcrumbs--current">{current}</div>
    </div>
  );
};

export default VitalsSummaryBreadcrumbs;
