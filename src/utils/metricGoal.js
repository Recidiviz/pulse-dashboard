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
    'revocation-admissions-snapshot-chart': {
      isUpward: false,
      value: 40,
      label: '40%',
    },
    'supervision-success-snapshot-chart': {
      isUpward: true,
      value: 70,
      label: '70%',
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

export {
  getGoalForChart
};
