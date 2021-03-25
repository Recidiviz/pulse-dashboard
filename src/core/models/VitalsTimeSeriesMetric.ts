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
import { VitalsTimeSeriesRecord, RawMetricData } from "./types";

export function vitalsTimeSeries(
  rawRecords: RawMetricData
): VitalsTimeSeriesRecord[] {
  return rawRecords.map((record) => {
    return {
      date: record.date,
      entityId: record.entity_id,
      metric: record.metric,
      value: Number(record.value),
      weeklyAvg: Number(record.avg_7d),
      parentWeeklyAvg: 100,
    };
  });
}
