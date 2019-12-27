// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import { getTooltipWithoutTrendline } from './trendline';

const monthsPerTimeWindow = {
  '3y': 36,
  '1y': 12,
  '6m': 6,
  '3m': 3,
  '1m': 1,
};

function toggleLabel(labelsByToggle, toggledValue) {
  if (labelsByToggle[toggledValue]) {
    return labelsByToggle[toggledValue];
  }

  return 'No label found';
}

function toggleYAxisTicks(metricType, chartMinValue, chartMaxValue, stepSize) {
  if (metricType === 'counts') {
    return {
      min: chartMinValue,
      max: chartMaxValue,
      stepSize,
    };
  }
  return {};
}

function getMonthCountFromTimeWindowToggle(toggledValue) {
  return monthsPerTimeWindow[toggledValue];
}

function getPeriodLabelFromTimeWindowToggle(toggledValue) {
  const months = getMonthCountFromTimeWindowToggle(toggledValue);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);

  return `${startDate.toLocaleDateString()} to present`;
}

function updateTooltipForMetricType(metricType, tooltipItem, data) {
  let label = data.datasets[tooltipItem.datasetIndex].label || '';

  if (metricType === 'rates') {
    return `${label}: ${getTooltipWithoutTrendline(tooltipItem, data, '%')}`;
  }

  // The below logic is the default tooltip logic for ChartJS 2
  if (label) {
    label += ': ';
  }

  if (tooltipItem.value) {
    label += tooltipItem.value;
  } else {
    label += tooltipItem.yLabel;
  }

  return label;
}

function createKeyFromElements(dataPoint, keyElements) {
  const dataElements = [];
  keyElements.forEach((element) => {
    dataElements.push(dataPoint[element]);
  });

  return dataElements.join('-');
}

function copyDataFieldsForKeyElements(dataPoint, keyElements) {
  const updatedDataPoint = {};
  keyElements.forEach((element) => {
    updatedDataPoint[element] = dataPoint[element];
  });
  return updatedDataPoint;
}

function filterDatasetByToggleFilters(dataset, toggleFilters, keyElements, valuesToCount) {
  let filteredDataset = [];
  const toggleKey = Object.keys(toggleFilters)[0];
  const toggleValue = toggleFilters[toggleKey].toUpperCase();

  if (toggleValue !== 'ALL') {
    filteredDataset = dataset
      .filter((element) => element[toggleKey].toUpperCase() === toggleValue);
  } else {
    const groupedByKey = {};
    dataset.forEach((data) => {
      const key = createKeyFromElements(data, keyElements);
      if (!groupedByKey[key]) {
        groupedByKey[key] = [];
      }
      groupedByKey[key].push(data);
    });

    Object.keys(groupedByKey).forEach((groupKey) => {
      const groupedDataPoints = groupedByKey[groupKey];
      const updatedDataPoint = copyDataFieldsForKeyElements(groupedDataPoints[0], keyElements);

      valuesToCount.forEach((key) => {
        updatedDataPoint[key] = groupedDataPoints.reduce(
          (a, b) => Number(a) + (Number(b[key]) || 0), 0,
        );
      });

      filteredDataset.push(updatedDataPoint);
    });
  }

  return filteredDataset;
}

function filterDatasetByDistrict(dataset, district, keyElements, valuesToCount) {
  return filterDatasetByToggleFilters(
    dataset, { district }, keyElements, valuesToCount,
  );
}

function filterDatasetBySupervisionType(dataset, supervisionType, keyElements, valuesToCount) {
  return filterDatasetByToggleFilters(
    dataset, { supervision_type: supervisionType }, keyElements, valuesToCount,
  );
}

function filterDatasetByTimeWindow(dataset, timeWindow) {
  return dataset.filter((element) => element.time_window === timeWindow);
}

function filterDatasetByToggleFiltersExplicitAll(dataset, toggleFilters) {
  const toggleKey = Object.keys(toggleFilters)[0];
  const toggleValue = toggleFilters[toggleKey].toUpperCase();

  return dataset.filter((element) => element[toggleKey].toUpperCase() === toggleValue);
}

function filterDatasetByDistrictExplicitAll(dataset, district) {
  return filterDatasetByToggleFiltersExplicitAll(dataset, { district });
}

function filterDatasetBySupervisionTypeExplicitAll(dataset, supervisionType) {
  return filterDatasetByToggleFiltersExplicitAll(dataset, { supervision_type: supervisionType });
}

export {
  toggleLabel,
  toggleYAxisTicks,
  getMonthCountFromTimeWindowToggle,
  getPeriodLabelFromTimeWindowToggle,
  updateTooltipForMetricType,
  filterDatasetByToggleFilters,
  filterDatasetByDistrict,
  filterDatasetBySupervisionType,
  filterDatasetByTimeWindow,
  filterDatasetByToggleFiltersExplicitAll,
  filterDatasetByDistrictExplicitAll,
  filterDatasetBySupervisionTypeExplicitAll,
};
