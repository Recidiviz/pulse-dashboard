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

import {
  getDimensionKey,
  getDimensionValue,
  getValueKey,
  validateMetadata,
} from "../../api/metrics/optimizedFormatHelpers";

function filterOptimizedDataFormat({ apiData, metadata, filterFn }) {
  let filteredDataPoints = [];
  if (Array.isArray(apiData[0])) {
    validateMetadata(metadata);
    const totalDataPoints = toInteger(metadata.total_data_points);
    const dimensions = metadata.dimension_manifest;
    const valueKeys = metadata.value_keys;

    let i = 0;
    for (i = 0; i < totalDataPoints; i += 1) {
      const dataPoint = {};
      let matchesFilter = true;

      let j = 0;
      for (j = 0; j < dimensions.length; j += 1) {
        const dimensionValueIndex = apiData[j][i];

        const dimensionKey = getDimensionKey(dimensions, j);
        const dimensionValue = getDimensionValue(
          dimensions,
          j,
          dimensionValueIndex
        );
        matchesFilter = filterFn(
          { [dimensionKey]: dimensionValue },
          dimensionKey
        );
        if (!matchesFilter) {
          break;
        }

        dataPoint[dimensionKey] = dimensionValue;
      }

      if (!matchesFilter) {
        /* eslint-disable-next-line no-continue */
        continue;
      }

      for (
        j = dimensions.length;
        j < dimensions.length + valueKeys.length;
        j += 1
      ) {
        const valueValue = apiData[j][i];
        const valueKey = getValueKey(valueKeys, j - dimensions.length);
        dataPoint[valueKey] = valueValue;
      }

      filteredDataPoints.push(dataPoint);
    }
  } else {
    filteredDataPoints = apiData.filter((item) => filterFn(item));
  }

  return filteredDataPoints;
}

function filterDatasetByMetricPeriodMonths(dataset, metricPeriodMonths) {
  return dataset.filter(
    (element) => element.metric_period_months === metricPeriodMonths
  );
}

function filterDatasetByToggleFilters(dataset, toggleFilters) {
  const toggleKey = Object.keys(toggleFilters)[0];
  const toggleValue = toggleFilters[toggleKey].toUpperCase();

  return dataset.filter(
    (element) =>
      String(element[toggleKey]).toUpperCase() === String(toggleValue)
  );
}

function filterDatasetByDistrict(dataset, districts) {
  return dataset.filter((element) =>
    districts
      .map((d) => d.toUpperCase())
      .includes(String(element.district).toUpperCase())
  );
}

function filterDatasetBySupervisionType(dataset, supervisionType) {
  return filterDatasetByToggleFilters(dataset, {
    supervision_type: supervisionType,
  });
}

export {
  filterOptimizedDataFormat,
  filterDatasetByMetricPeriodMonths,
  filterDatasetByDistrict,
  filterDatasetBySupervisionType,
};
