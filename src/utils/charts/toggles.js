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

import moment from "moment";
import { getTooltipWithoutTrendline } from "./trendline";
import { isDenominatorStatisticallySignificant } from "./significantStatistics";

function toggleLabel(labelsByToggle, toggledValue) {
  if (labelsByToggle[toggledValue]) {
    return labelsByToggle[toggledValue];
  }

  return "No label found";
}

function toggleYAxisTicksFor(
  desiredMetricType,
  currentMetricType,
  minValue,
  maxValue,
  stepSize
) {
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
  canDisplayChartGoal,
  minValue,
  maxValue,
  stepSize,
  otherOptions
) {
  return {
    ...(canDisplayChartGoal
      ? {
          min: minValue,
          max: maxValue,
          stepSize,
        }
      : {}),
    ...otherOptions,
  };
}

function toggleYAxisTicksAdditionalOptions(
  desiredMetricType,
  currentMetricType,
  minValue,
  maxValue,
  stepSize,
  otherOptions
) {
  return {
    ...toggleYAxisTicksFor(
      desiredMetricType,
      currentMetricType,
      minValue,
      maxValue,
      stepSize
    ),
    ...otherOptions,
  };
}

function toggleYAxisTicksStackedRateBasicCount(metricType, maxCount) {
  if (metricType === "rates") {
    return {
      min: 0,
      max: 100,
      stepSize: 20,
    };
  }

  return {
    min: 0,
    max: maxCount,
  };
}

function getMonthCountFromMetricPeriodMonthsToggle(toggledValue) {
  return Number(toggledValue);
}

function getPeriodLabelFromMetricPeriodMonthsToggle(toggledValue) {
  const months = getMonthCountFromMetricPeriodMonthsToggle(toggledValue);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);

  return `${moment(startDate).format("M/D/YYYY")} to present`;
}

function getTrailingLabelFromMetricPeriodMonthsToggle(toggledValue) {
  if (toggledValue === "1") {
    return "Current month";
  }
  if (toggledValue === "3" || toggledValue === "6" || toggledValue === "12") {
    return `Last ${toggledValue} months`;
  }
  return `Last ${parseInt(toggledValue, 10) / 12} years`;
}

function standardTooltipForCountMetric(tooltipItem, data) {
  let label = data.datasets[tooltipItem.datasetIndex].label || "";

  // The below logic is the default tooltip logic for ChartJS 2
  if (label) {
    label += ": ";
  }

  if (tooltipItem.value) {
    label += tooltipItem.value;
  } else {
    label += tooltipItem.yLabel;
  }

  return label;
}

function standardTooltipForRateMetric(tooltipItem, data) {
  const label = data.datasets[tooltipItem.datasetIndex].label || "";
  return `${label}: ${getTooltipWithoutTrendline(tooltipItem, data, "%")}`;
}

function tooltipForRateMetricWithCounts(
  id,
  tooltipItem,
  data,
  numerators,
  denominators,
  includeWarning
) {
  const { datasetIndex, index: dataPointIndex } = tooltipItem;
  const label = data.datasets[datasetIndex].label || "";

  const isNested = Array.isArray(numerators[datasetIndex]);
  const numerator = isNested
    ? numerators[datasetIndex][dataPointIndex]
    : numerators[dataPointIndex];
  const denominator = isNested
    ? denominators[datasetIndex][dataPointIndex]
    : denominators[dataPointIndex];
  let appendedCounts = "";
  if (numerator !== undefined && denominator !== undefined) {
    appendedCounts = ` (${numerator}/${denominator})`;
  }

  const cue =
    includeWarning && !isDenominatorStatisticallySignificant(denominator)
      ? " *"
      : "";

  return id !== "admissionsByRace"
    ? `${label}: ${getTooltipWithoutTrendline(
        tooltipItem,
        data,
        "%"
      )}${appendedCounts}${cue}`
    : `${getTooltipWithoutTrendline(
        tooltipItem,
        data,
        ""
      )}${appendedCounts}${cue}`;
}

function updateTooltipForMetricType(metricType, tooltipItem, data) {
  if (metricType === "rates") {
    return standardTooltipForRateMetric(tooltipItem, data);
  }

  return standardTooltipForCountMetric(tooltipItem, data);
}

function canDisplayGoal(goal, toggles) {
  if (toggles.disableGoal === true) {
    return false;
  }

  if (toggles.geoView) {
    return false;
  }

  let canDisplay = true;
  if (toggles.metricType && goal.metricType) {
    canDisplay = canDisplay && goal.metricType === toggles.metricType;
  }
  if (toggles.supervisionType) {
    canDisplay = canDisplay && toggles.supervisionType.toUpperCase() === "ALL";
  }
  if (toggles.district) {
    canDisplay = canDisplay && toggles.district[0].toUpperCase() === "ALL";
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
    labels.unshift("");
    labels.push("");
  }
}

export {
  toggleLabel,
  toggleYAxisTicksFor,
  toggleYAxisTicksBasedOnGoal,
  toggleYAxisTicksAdditionalOptions,
  toggleYAxisTicksStackedRateBasicCount,
  getMonthCountFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
  getTrailingLabelFromMetricPeriodMonthsToggle,
  standardTooltipForCountMetric,
  standardTooltipForRateMetric,
  tooltipForRateMetricWithCounts,
  updateTooltipForMetricType,
  canDisplayGoal,
  centerSingleMonthDatasetIfNecessary,
};
