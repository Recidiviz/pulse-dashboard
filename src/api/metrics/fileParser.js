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
import toInteger from "lodash/fp/toInteger";
import { convertFromStringToUnflattenedMatrix } from "shared-filters";
import expandMetricRepresentation from "./optimizedMetricFileParser";

export function unflattenValues(metricFile) {
  const totalDataPoints = toInteger(metricFile.metadata.total_data_points);
  return totalDataPoints === 0
    ? []
    : convertFromStringToUnflattenedMatrix(
        metricFile.flattenedValueMatrix,
        totalDataPoints
      );
}

/**
 * Parses the given metric response based on the format of the given data.
 */
const parseResponseByFileFormat = (responseData, file, eagerExpand = true) => {
  const metricFile = responseData[file];

  if (!metricFile)
    throw new Error(`Response payload for file ${file} is empty`);

  // If it's in the expanded json format that is ready to go, return that.
  // The metricFile format should be { data, metadata } for all dashboards except US_ND
  if (Array.isArray(metricFile.data)) {
    return metricFile;
  }

  // TODO: Align US_ND endpoint responses with the other dashboards to return { data, metadata }
  if (Array.isArray(metricFile)) {
    return {
      data: metricFile,
      metadata: {},
    };
  }

  // If it has the key flattenedValueMatrix, it's the optimized format.
  // If eagerExpand is true, convert the optimized format to an array of js objects
  if (metricFile.flattenedValueMatrix && eagerExpand) {
    return {
      data: expandMetricRepresentation(
        metricFile.flattenedValueMatrix,
        metricFile.metadata
      ),
      metadata: metricFile.metadata,
    };
  }

  // If it's the optimized format but we don't want to eagerly expand,
  // then proactively unflatten the data matrix to avoid repeated unflattening operations in
  // filtering operations later on.
  return {
    data: unflattenValues(metricFile),
    metadata: metricFile.metadata,
  };
};

/**
 * Parses the given metric responses which is assumed to have multiple metric files,
 * one per object key.
 */
const parseResponsesByFileFormat = (responseData, eagerExpand = true) => {
  const parsedResponses = {};
  const files = Object.keys(responseData);

  files.forEach((file) => {
    const parsedResponse = parseResponseByFileFormat(
      responseData,
      file,
      eagerExpand
    );
    parsedResponses[file] = parsedResponse;
  });

  return parsedResponses;
};

export { parseResponseByFileFormat, parseResponsesByFileFormat };
