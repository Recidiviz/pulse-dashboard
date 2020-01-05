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

import { COLORS } from '../../assets/scripts/constants/colors';
import { trendlineSlope } from './trendline';
import { canDisplayGoal } from './toggles';

// TODO(75): Retrieve these dynamically using the API
const GOALS = {
  US_ND: {
    daysAtLibertySnapshot: {
      isUpward: true,
      value: 1095,
      label: '1095 days (3 years)',
      metricType: null,
    },
    lsirScoreChangeSnapshot: {
      isUpward: false,
      value: -1,
      label: '-1.0',
      metricType: null,
    },
    reincarcerationCountsByMonth: {
      isUpward: false,
      value: 30,
      label: '30',
      metricType: 'counts',
    },
    revocationAdmissionsSnapshot: {
      isUpward: false,
      value: 35,
      label: '35%',
      metricType: 'rates',
    },
    revocationCountsByMonth: {
      isUpward: false,
      value: 30,
      label: '30',
      metricType: 'counts',
    },
    supervisionSuccessSnapshot: {
      isUpward: true,
      value: 75,
      label: '75%',
      metricType: 'rates',
    },
  },
};

function Goal(isUpward, value, label, metricType) {
  this.isUpward = isUpward;
  this.value = value;
  this.label = label;
  this.metricType = metricType;
}

function getGoalForChart(stateCode, chartId) {
  const goalDict = GOALS[stateCode][chartId];
  return new Goal(goalDict.isUpward, goalDict.value, goalDict.label, goalDict.metricType);
}

function goalLabelContentString(goal) {
  return 'goal: '.concat(goal.label);
}

/**
 * Returns the string value describing whether the data is trending towards
 * or away from the goal.
 */
function trendlineGoalText(trendlineValues, goal) {
  const towards = 'towards the goal';
  const away = 'away from the goal';
  const slopeOfTrendline = trendlineSlope(trendlineValues);
  let trendlineText = '';

  if (goal.isUpward) {
    trendlineText = (slopeOfTrendline > 0) ? towards : away;
  } else {
    trendlineText = (slopeOfTrendline < 0) ? towards : away;
  }

  return trendlineText;
}

/**
 * Returns a value that is at least one stepSize lower than either the minimum
 * data point on the chart or the value of the goal line, whichever is lower,
 * and that is a multiple of the stepSize on the chart.
 * This ensures the chart has space to show all of the data and the goal line.
 */
function getMinForGoalAndData(goalValue, dataPoints, stepSize) {
  let minValue = Math.min(...dataPoints);
  if (goalValue < minValue) {
    minValue = goalValue;
  }
  return (minValue - stepSize) - ((minValue - stepSize) % stepSize);
}

/**
 * Returns a value that is at least one stepSize higher than either the maximum
 * data point on the chart or the value of the goal line, whichever is higher,
 * and that is a multiple of the stepSize on the chart.
 * This ensures the chart has space to show all of the data and the goal line.
 */
function getMaxForGoalAndData(goalValue, dataPoints, stepSize) {
  let maxValue = Math.max(...dataPoints);
  if (goalValue > maxValue) {
    maxValue = goalValue;
  }
  return (maxValue + stepSize) + (stepSize - (maxValue % stepSize));
}

function chartAnnotationForGoal(goal, annotationId, overrides) {
  return {
    drawTime: 'afterDatasetsDraw',
    events: ['click'],

    // Array of annotation configuration objects
    // See below for detailed descriptions of the annotation options
    annotations: [{
      type: overrides.type || 'line',
      mode: overrides.mode || 'horizontal',
      value: goal.value,

      // optional annotation ID (must be unique)
      id: annotationId,
      scaleID: 'y-axis-0',

      drawTime: 'afterDatasetsDraw',

      borderColor: COLORS['red-standard'],
      borderWidth: 2,
      borderDash: [2, 2],
      borderDashOffset: 5,
      label: {
        enabled: true,
        content: goalLabelContentString(goal),
        position: overrides.position || 'right',

        // Background color of label, default below
        backgroundColor: 'rgba(0, 0, 0, 0)',

        fontFamily: 'sans-serif',
        fontSize: 12,
        fontStyle: 'bold',
        fontColor: COLORS['red-standard'],

        // Adjustment along x-axis (left-right) of label relative to above
        // number (can be negative). For horizontal lines positioned left
        // or right, negative values move the label toward the edge, and
        // positive values toward the center.
        xAdjust: overrides.xAdjust || 0,

        // Adjustment along y-axis (top-bottom) of label relative to above
        // number (can be negative). For vertical lines positioned top or
        // bottom, negative values move the label toward the edge, and
        // positive values toward the center.
        yAdjust: overrides.yAdjust || -10,
      },

      onClick(e) { return e; },
    }],
  };
}

export {
  getGoalForChart,
  getMaxForGoalAndData,
  getMinForGoalAndData,
  goalLabelContentString,
  trendlineGoalText,
  chartAnnotationForGoal,
};
