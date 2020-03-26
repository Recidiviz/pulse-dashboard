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

import '@testing-library/jest-dom/extend-expect';

import * as metricGoal from '../metricGoal';

const FIRST_GOAL = {
    isUpward: false,
    value: 30,
    label: '30',
    metricType: 'counts',
};

const SECOND_GOAL = {
    isUpward: true,
    value: 75,
    label: '75%',
    metricType: 'rates',
}

it("get goal for chart", () => {
    const { isUpward, value, label, metricType } = metricGoal.getGoalForChart("US_ND", "reincarcerationCountsByMonth");

    expect(isUpward).toBe(false);
    expect(value).toBe(30);
    expect(label).toBe("30");
    expect(metricType).toBe("counts");
})

it("get goal label content string", () => {
    const goalLabel = metricGoal.goalLabelContentString(FIRST_GOAL);

    expect(goalLabel).toMatch('goal: ');
})

it("data is trending towards to goal", () => {
    const trendlineValues = [1, 2, 3, 4, 5];
    const trendlineText = metricGoal.trendlineGoalText(trendlineValues, SECOND_GOAL);

    expect(trendlineText).toBe("towards the goal");
})

it("data is trending away from goal", () => {
    const trendlineValues = [10, 2, 3, 4, 5];
    const trendlineText = metricGoal.trendlineGoalText(trendlineValues, SECOND_GOAL);

    expect(trendlineText).toBe("away from the goal");
})

it("min for goal and data", () => {
    const goalValue = 32;
    const dataPoints = [5, 7, 9, 16, 34, 14];
    const stepSize = 4;

    const minForGoalAndData = metricGoal.getMinForGoalAndData(goalValue, dataPoints, stepSize);

    expect(minForGoalAndData).toBe(0);
})

it("max for goal and data", () => {
    const goalValue = 16;
    const dataPoints = [2, 7, 3, 5, 26, 9];
    const stepSize = 3;

    const minForGoalAndData = metricGoal.getMaxForGoalAndData(goalValue, dataPoints, stepSize);

    expect(minForGoalAndData).toBe(30);
})

it("min for goal and data randomized", () => {
    const goalValue = Math.floor(Math.random() * 35);
    const dataPoints = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
    const stepSize = Math.floor(Math.random() * 10);

    const minForGoalAndData = metricGoal.getMinForGoalAndData(goalValue, dataPoints, stepSize);

    expect(minForGoalAndData).toBeNumber();
})

it("max for goal and data randomized", () => {
    const goalValue = Math.floor(Math.random() * 35);
    const dataPoints = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
    const stepSize = Math.floor(Math.random() * 10);

    const maxForGoalAndData = metricGoal.getMaxForGoalAndData(goalValue, dataPoints, stepSize);

    expect(maxForGoalAndData).toBeNumber();
})
