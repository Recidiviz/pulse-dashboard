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

import mapValues from "lodash/fp/mapValues";
import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";
import upperCase from "lodash/fp/upperCase";

import { numberFromOfficerId } from "../../../../utils/transforms/labels";
import { configureDownloadButtons } from "../../../../assets/scripts/utils/downloads";

const sum = (a, b) => a + b;

/**
 * Checks if officer has valid name or not empty
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
 * Organizes the labels and data points so the chart can display the values
 * for the officers in the given `visibleOffice`.
 * `dataPoints` must be a dictionary where the office names are the keys,
 * and the values are arrays of dictionaries with values for the following keys:
 *    - officerID
 *    - violationsByType
 * Returns an array of officer ID labels and a dictionary of data points for
 * each violation type.
 */
export const prepareData = (bars, metricType) => (data) => {
  const officerId = numberFromOfficerId(data.officer_external_id);

  const violationCountsByType = reduce(
    (counts, { key }) => ({ ...counts, [key]: toInteger(data[key]) }),
    {},
    bars
  );

  if (metricType === "counts") {
    return {
      officerId,
      violationsByType: violationCountsByType,
    };
  }
  if (metricType === "rates") {
    const totalCount = pipe(values, reduce(sum, 0))(violationCountsByType);
    const violationRatesByType = mapValues(
      (count) => 100 * (count / totalCount),
      violationCountsByType
    );

    return {
      officerId,
      violationsByType: violationRatesByType,
    };
  }
  return null;
};

export function configureDownloads(
  chartId,
  officerLabels,
  officerViolationCountsByType,
  offices,
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
    data: officerViolationCountsByType[bar.key],
  }));

  const humanReadableOfficerLabels = officerLabels.map(
    (element) => `Officer ${element}`
  );

  const chartTitle = `${upperCase(exportLabel)}`;

  const convertValuesToNumbers = false;

  configureDownloadButtons(
    chartId,
    chartTitle,
    downloadableDataFormat,
    humanReadableOfficerLabels,
    document.getElementById(chartId),
    exportedStructureCallback,
    toggles,
    convertValuesToNumbers
  );
}
