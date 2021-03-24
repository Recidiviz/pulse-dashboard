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
import { VitalsEntityRecord, RawMetricData } from "./types";

export function vitalsEntity(rawRecords: RawMetricData): VitalsEntityRecord[] {
  return rawRecords.map((record) => {
    return {
      entityId: record.entity_id,
      entityName: record.entity_name,
      parentEntityId: record.parent_entity_id,
      overall: Number(record.overall),
      discharge: Number(record.timely_discharge),
      participation: Number(record.timely_ftr_enrollment),
      contacts: Number(record.timely_contacts),
      assessments: Number(record.timely_risk_assessment),
      change7Day: Number(record.overall_7d),
      change28Day: Number(record.overall_28d),
    };
  });
}
