import React from 'react';
import { render } from '@testing-library/react';
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
    const goalValue = Math.floor(Math.random() * 35);
    const dataPoints = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
    const stepSize = Math.floor(Math.random() * 10);

    const minForGoalAndData = metricGoal.getMinForGoalAndData(goalValue, dataPoints, stepSize);

    expect(minForGoalAndData).toBeNumber();
})

it("max for goal and data", () => {
    const goalValue = Math.floor(Math.random() * 35);
    const dataPoints = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
    const stepSize = Math.floor(Math.random() * 10);

    const maxForGoalAndData = metricGoal.getMaxForGoalAndData(goalValue, dataPoints, stepSize);

    expect(maxForGoalAndData).toBeNumber();
})