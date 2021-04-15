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

function formatOfficeName(name: string): string {
  return `${toTitleCase(name)} Office`;
}

function formatOfficerName(name: string): string {
  const nameWithoutId = name.split(": ").pop();
  return nameWithoutId || name;
}

type PropTypes = {
  stateName: string;
  entity: VitalsSummaryRecord;
};

const VitalsSummaryBreadcrumbs: React.FC<PropTypes> = ({
  stateName,
  entity,
}) => {
  const { entityName, entityType, parentEntityName, parentEntityId } = entity;
  let primary;
  let secondary;
  let tertiary;

  switch (entityType) {
    case ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION:
      primary = formatOfficeName(entityName);
      secondary = stateName;
      tertiary = undefined;
      break;
    case ENTITY_TYPES.PO:
      primary = formatOfficerName(entityName);
      secondary = stateName;
      tertiary = formatOfficeName(parentEntityName);
      break;
    default:
      primary = stateName;
      secondary = undefined;
      tertiary = undefined;
  }

  return (
    <div className="VitalsSummaryBreadcrumbs">
      <Link className="VitalsSummaryBreadcrumbs--state" to="/community/vitals">
        {secondary}
      </Link>
      {tertiary && (
        <Link
          className="VitalsSummaryBreadcrumbs--parent"
          to={`/community/vitals/${convertIdToSlug(parentEntityId)}`}
        >
          {tertiary}
        </Link>
      )}
      <div className="VitalsSummaryBreadcrumbs--current">{primary}</div>
    </div>
  );
};

export default VitalsSummaryBreadcrumbs;
