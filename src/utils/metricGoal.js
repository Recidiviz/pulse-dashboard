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

import { trendlineSlope } from './trendline';

// TODO(75): Retrieve these dynamically using the API
const GOALS = {
  US_ND: {
    'days-at-liberty-snapshot-chart': {
      isUpward: true,
      value: 1095,
      label: '1095 days (3 years)',
    },
    'lsir-score-change-snapshot-chart': {
      isUpward: false,
      value: -1,
      label: '-1.0',
    },
    'reincarceration-counts-by-month-chart': {
      isUpward: false,
      value: 30,
      label: '30%',
    },
    'revocation-admissions-snapshot-chart': {
      isUpward: false,
      value: 35,
      label: '35%',
    },
    'revocation-counts-by-month-chart': {
      isUpward: false,
      value: 30,
      label: '30',
    },
    'supervision-success-snapshot-chart': {
      isUpward: true,
      value: 75,
      label: '75%',
    },
  },
};

function Goal(isUpward, value, label) {
  this.isUpward = isUpward;
  this.value = value;
  this.label = label;
}

function getGoalForChart(stateCode, chartName) {
  const goalDict = GOALS[stateCode][chartName];
  return new Goal(goalDict.isUpward, goalDict.value, goalDict.label);
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

export {
  getGoalForChart,
  getMaxForGoalAndData,
  getMinForGoalAndData,
  goalLabelContentString,
  trendlineGoalText,
};
