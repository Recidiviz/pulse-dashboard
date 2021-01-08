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
import get from "lodash/fp/get";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import pipe from "lodash/fp/pipe";
import filter from "lodash/fp/filter";
import getOr from "lodash/fp/getOr";
import flatten from "lodash/fp/flatten";
import max from "lodash/fp/max";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";

import { matrixViolationTypeToLabel } from "../../../../utils/transforms/labels";

const getInteger = (field) => pipe(get(field), toInteger);

export const VIOLATION_COUNTS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const sumByInteger = (field) => sumBy(getInteger(field));

export const getReportedViolationsSum = (filteredData) =>
  pipe(
    (count) =>
      filter((data) => data.reported_violations === count, filteredData),
    sumByInteger("total_revocations")
  );

export const getMaxRevocations = (dataMatrix, violationTypes) =>
  pipe(
    () =>
      violationTypes.map((rowLabel) =>
        VIOLATION_COUNTS.map((columnLabel) =>
          getOr(0, [rowLabel, columnLabel], dataMatrix)
        )
      ),
    flatten,
    max
  );

export const getDataMatrix = pipe(
  groupBy("violation_type"),
  mapValues(
    pipe(
      groupBy("reported_violations"),
      mapValues(sumByInteger("total_revocations"))
    )
  )
);

export const getDataFilteredByViolationType = (dataFilter, violationTypes) =>
  pipe(
    dataFilter,
    filter((data) => violationTypes.includes(data.violation_type))
  );

export const getExportableMatrixData = (dataMatrix, violationTypes) =>
  violationTypes.map((rowLabel) => ({
    label: matrixViolationTypeToLabel[rowLabel],
    data: VIOLATION_COUNTS.map((columnLabel) =>
      getOr(0, [rowLabel, columnLabel], dataMatrix)
    ),
  }));
