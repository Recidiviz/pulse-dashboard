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

function toggleLabel(labelsByToggle, toggledValue) {
  if (labelsByToggle[toggledValue]) {
    return labelsByToggle[toggledValue];
  }

  return 'No label found';
}

function toggleYAxisTicksFor(desiredMetricType, currentMetricType, minValue, maxValue, stepSize) {
  if (currentMetricType === desiredMetricType) {
    return {
      min: minValue,
      max: maxValue,
      stepSize,
    };
  }

  return {
    min: undefined,
    max: undefined,
    stepSize: undefined,
  };
}

function toggleYAxisTicksBasedOnGoal(
  canDisplayChartGoal, minValue, maxValue, stepSize, otherOptions,
) {
  let ticks = {
    min: undefined,
    max: undefined,
    stepSize: undefined,
  };

  if (canDisplayChartGoal) {
    ticks = {
      min: minValue,
      max: maxValue,
      stepSize,
    };
  }

  for (let key in Object.keys(otherOptions)) {
    ticks[key] = otherOptions[key];
  }
  return ticks;
}

function toggleYAxisTicksAdditionalOptions(
  desiredMetricType, currentMetricType, minValue, maxValue, stepSize, otherOptions,
) {
  const ticks = toggleYAxisTicksFor(
    desiredMetricType, currentMetricType, minValue, maxValue, stepSize,
  );

  for (let key in Object.keys(otherOptions)) {
    ticks[key] = otherOptions[key];
  }
  return ticks;
}

function toggleYAxisTicksStackedRateBasicCount(metricType, maxCount) {
  if (metricType === 'rates') {
    return {
      min: 0,
      max: 100,
      stepSize: 20,
    };
  }

  return {
    min: 0,
    max: maxCount,
    stepSize: undefined,
  };
}

function getMonthCountFromTimeWindowToggle(toggledValue) {
  return Number(toggledValue);
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

function filterDatasetByTimeWindow(dataset, timeWindow) {
  return dataset.filter((element) => element.time_window === timeWindow);
}

function filterDatasetByToggleFilters(dataset, toggleFilters) {
  const toggleKey = Object.keys(toggleFilters)[0];
  const toggleValue = toggleFilters[toggleKey].toUpperCase();

  return dataset.filter((element) => element[toggleKey].toUpperCase() === toggleValue);
}

function filterDatasetByDistrict(dataset, district) {
  return filterDatasetByToggleFilters(dataset, { district });
}

function filterDatasetBySupervisionType(dataset, supervisionType) {
  return filterDatasetByToggleFilters(dataset, { supervision_type: supervisionType });
}

function canDisplayGoal(goal, currentToggleStates) {
  if (currentToggleStates.geoView) {
    return false;
  }

  let canDisplay = true;
  if (currentToggleStates.metricType && goal.metricType) {
    canDisplay = canDisplay && goal.metricType === currentToggleStates.metricType;
  }
  if (currentToggleStates.supervisionType) {
    canDisplay = canDisplay && currentToggleStates.supervisionType.toUpperCase() === 'ALL';
  }
  if (currentToggleStates.district) {
    canDisplay = canDisplay && currentToggleStates.district.toUpperCase() === 'ALL';
  }
  return canDisplay;
}

function centerSingleMonthDatasetIfNecessary(dataValues, labels) {
  // Places empty, invisible data points on either side of the single datapoint to center it
  if (dataValues.length === 1) {
    dataValues.unshift(null);
    dataValues.push(null);
  }
  if (labels.length === 1) {
    labels.unshift('');
    labels.push('');
  }
}

export {
  toggleLabel,
  toggleYAxisTicksFor,
  toggleYAxisTicksBasedOnGoal,
  toggleYAxisTicksAdditionalOptions,
  toggleYAxisTicksStackedRateBasicCount,
  getMonthCountFromTimeWindowToggle,
  getPeriodLabelFromTimeWindowToggle,
  updateTooltipForMetricType,
  filterDatasetByTimeWindow,
  filterDatasetByDistrict,
  filterDatasetBySupervisionType,
  canDisplayGoal,
  centerSingleMonthDatasetIfNecessary,
};
