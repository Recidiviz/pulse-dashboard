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

import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";
import upperCase from "lodash/fp/upperCase";

import { configureDownloadButtons } from "../../../../assets/scripts/utils/downloads";

/**
 * Casts arguments to integer and sum it.
 */
export const sum = (a, b) => toInteger(a) + toInteger(b);

/**
 * Internal function for concatinating arrays at the time of merge.
 * Links: https://lodash.com/docs/4.17.15#mergeWith
 */
export const mergeAllResolver = (objValue, srcValue) =>
  Array.isArray(objValue) ? objValue.concat(srcValue) : [objValue, srcValue];

/**
 * Checks if officer has valid and not empty name.
 */
export const isValidOfficer = (offices) => ({
  officer_external_id: officerIDRaw,
  district: officeId,
}) => {
  const officeName = offices[toInteger(officeId)];
  return officeName && officerIDRaw !== "OFFICER_UNKNOWN";
};

export const isValidOffice = (visibleOffices) => ({ district: officeId }) => {
  if (visibleOffices.length === 1 && visibleOffices[0] === "all") {
    return true;
  }
  return visibleOffices.includes(officeId);
};

/**
 * Groups dataset by month/year and sum all bar counters.
 */
export const groupByMonth = (barKeys) => (dataset) =>
  pipe(
    groupBy((item) => `${item.year}-${item.month}`),
    values,
    map((data) => ({
      year: data[0].year,
      month: data[0].month,
      ...reduce(
        (acc, barKey) => ({
          ...acc,
          [barKey]: sumBy((o) => toInteger(o[barKey]), data),
        }),
        {},
        barKeys
      ),
    }))
  )(dataset);

export function configureDownloads(
  chartId,
  chartLabels,
  countsByType,
  visibleOffices,
  exportLabel,
  bars,
  toggles
) {
  const exportedStructureCallback = () => ({
    office: visibleOffices.join(", "),
    metric: exportLabel,
    series: [],
  });

  const downloadableDataFormat = bars.map((bar) => ({
    label: bar.label,
    data: countsByType[bar.key],
  }));

  const chartTitle = upperCase(exportLabel);

  const convertValuesToNumbers = false;

  configureDownloadButtons(
    chartId,
    chartTitle,
    downloadableDataFormat,
    chartLabels,
    document.getElementById(chartId),
    exportedStructureCallback,
    toggles,
    convertValuesToNumbers
  );
}

export const isOfficerIdsHidden = (offices) =>
  (offices.length === 1 && offices[0] === "all") || offices.length > 3;
