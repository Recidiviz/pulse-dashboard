// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import {
  standardTooltipForCountMetricLabel,
  tooltipWithoutTrendlineLabel,
} from "../../utils/tooltips";

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

function updateTooltipForMetricType(metricType, tooltipItem, data) {
  if (metricType === "rates") {
    return standardTooltipForRateMetric(tooltipItem, data);
  }

  return standardTooltipForCountMetricLabel(tooltipItem, data);
}

function standardTooltipForRateMetric(tooltipItem, data) {
  const label = data.datasets[tooltipItem.datasetIndex].label || "";
  return `${label}: ${tooltipWithoutTrendlineLabel(tooltipItem, data, "%")}`;
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

function tooltipForCountChart(
  firstDataset,
  firstPrefix,
  secondDataset,
  secondPrefix
) {
  return {
    title: (tooltipItem, data) => data.labels[tooltipItem[0].index],
    label: (tooltipItem, data) => {
      const { index } = tooltipItem;

      const datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
      let countValue = [];
      if (datasetLabel.startsWith(firstPrefix)) {
        countValue = firstDataset[index];
      } else if (datasetLabel.startsWith(secondPrefix)) {
        countValue = secondDataset[index];
      } else {
        countValue = 0;
      }

      return `${data.datasets[tooltipItem.datasetIndex].label}: ${countValue}`;
    },
  };
}

function tooltipForRateChart() {
  return {
    title: (tooltipItem, data) => {
      const dataset = data.datasets[tooltipItem[0].datasetIndex];
      return dataset.label;
    },
    label: (tooltipItem, data) => {
      const dataset = data.datasets[tooltipItem.datasetIndex];
      const currentValue = dataset.data[tooltipItem.index];

      return `${currentValue.toFixed(2)}% of ${data.labels[tooltipItem.index]}`;
    },
  };
}
export {
  toggleLabel,
  toggleYAxisTicksFor,
  toggleYAxisTicksBasedOnGoal,
  toggleYAxisTicksAdditionalOptions,
  toggleYAxisTicksStackedRateBasicCount,
  standardTooltipForRateMetric,
  updateTooltipForMetricType,
  canDisplayGoal,
  tooltipForCountChart,
  tooltipForRateChart,
};
