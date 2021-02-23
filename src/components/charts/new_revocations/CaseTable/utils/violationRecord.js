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
import { translate } from "../../../../../utils/i18nSettings";

export function parseViolationRecord(recordLabel = "") {
  if (!recordLabel) {
    return {};
  }

  return recordLabel.split(";").reduce((acc, recordPart) => {
    const match = recordPart.match(/(?<number>\d+)(?<abbreviation>\w+)/);

    if (!match) return acc;

    return {
      ...acc,
      [match.groups.abbreviation]: parseInt(match.groups.number),
    };
  }, {});
}

function formatViolationRecord(records) {
  const violationSeverities = translate("violationsBySeverity");

  const notEmptySeverities = violationSeverities.reduce((acc, violation) => {
    if (records[violation]) {
      acc.push(`${records[violation]} ${violation}`);
    }

    return acc;
  }, []);

  return notEmptySeverities.join(", ");
}

export const parseAndFormatViolationRecord = compose(
  formatViolationRecord,
  parseViolationRecord
);
