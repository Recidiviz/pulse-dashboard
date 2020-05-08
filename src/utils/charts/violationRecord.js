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

  return recordLabel
    .split(";")
    .map((recordPart) => recordPart.match(recordPartRegex).groups);
}

export function sumViolationRecords(records) {
  return records.reduce((acc, record) => acc + record.number, 0);
}

export const violationComparator = (a, b) =>
  VIOLATION_SEVERITY.indexOf(a.abbreviation) -
  VIOLATION_SEVERITY.indexOf(b.abbreviation);

export function violationRecordComparator(aRecordLabel, bRecordLabel) {
  const aRecords = parseViolationRecord(aRecordLabel).sort(violationComparator);
  const bRecords = parseViolationRecord(bRecordLabel).sort(violationComparator);

  const aSum = sumViolationRecords(aRecords);
  const bSum = sumViolationRecords(bRecords);

  if (aSum > bSum) return 1;
  if (aSum < bSum) return -1;

  for (let i = 0; i < aRecords.length; i += 1) {
    const aRecord = aRecords[i];
    const bRecord = bRecords[i];

    if (
      VIOLATION_SEVERITY.indexOf(aRecord.abbreviation) >
      VIOLATION_SEVERITY.indexOf(bRecord.abbreviation)
    ) {
      return 1;
    }
    if (
      VIOLATION_SEVERITY.indexOf(aRecord.abbreviation) <
      VIOLATION_SEVERITY.indexOf(bRecord.abbreviation)
    ) {
      return -1;
    }
    if (aRecord.number > bRecord.number) return 1;
    if (aRecord.number < bRecord.number) return -1;
  }

  return 0;
}

const violationFormatter = (record) =>
  `${record.number} ${record.abbreviation}`;

export function formatViolationRecord(records) {
  if (records.length === 0) {
    return "";
  }

  return records
    .slice()
    .sort(violationComparator)
    .map(violationFormatter)
    .join(", ");
}

export const parseAndFormatViolationRecord = compose(
  formatViolationRecord,
  parseViolationRecord
);
