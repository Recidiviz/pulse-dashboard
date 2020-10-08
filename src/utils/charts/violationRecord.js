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

import compose from "lodash/fp/compose";

const VIOLATION_SEVERITY = ["fel", "misd", "absc", "muni", "subs", "tech"];

const recordPartRegex = /(?<number>\d+)(?<abbreviation>\w+)/;

function parseViolationRecord(recordLabel = "") {
  if (!recordLabel) {
    return [];
  }

  return recordLabel.split(";").map((recordPart) => {
    const record = recordPart.match(recordPartRegex).groups;
    record.number = parseInt(record.number, 0);
    return record;
  });
}

export function sumViolationRecords(records) {
  return records.reduce((acc, record) => acc + record.number, 0);
}

export function compareViolationRecords(aRecordLabel, bRecordLabel, order) {
  const aRecords = parseViolationRecord(aRecordLabel);
  const bRecords = parseViolationRecord(bRecordLabel);

  const aSum = sumViolationRecords(aRecords);
  const bSum = sumViolationRecords(bRecords);

  if (aSum > bSum) return 1;
  if (aSum < bSum) return -1;

  for (let i = VIOLATION_SEVERITY.length - 1; i >= 0; i -= 1) {
    const violationSeverity = VIOLATION_SEVERITY[i];

    const aRecord = aRecords.find((r) => r.abbreviation === violationSeverity);
    const bRecord = bRecords.find((r) => r.abbreviation === violationSeverity);

    if (aRecord && !bRecord) return order === "desc" ? -1 : 1;
    if (!aRecord && bRecord) return order === "desc" ? 1 : -1;

    if (aRecord && bRecord) {
      if (aRecord.number > bRecord.number) return order === "desc" ? -1 : 1;
      if (aRecord.number < bRecord.number) return order === "desc" ? 1 : -1;
    }
  }

  return 0;
}

export const parseAndFormatViolationRecord = compose(parseViolationRecord);
