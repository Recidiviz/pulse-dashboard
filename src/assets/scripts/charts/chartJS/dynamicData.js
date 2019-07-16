// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2018 Recidiviz, Inc.
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

import * as $ from 'jquery';
import { reduce, flatten, map, filter, isEqual, sortBy, pickBy } from 'lodash';

import {
  revocationsByRace, revocationsBySupervisionType, revocationsByRevocationType,
  reincarcerationsByRace, reincarcerationsByGender,
  reincarcerationsBySentenceLength, revocationExploration,
  reincarcerationExploration,
} from '../../metrics';

import { COLORS, COLOR_ROTATION } from '../../constants/colors';
import { normalizeLabel, nullSafeToLowerCase } from '../../utils/strings';
import { getMonthsBetween } from '../../utils/time';

function addDataset(chart, dataset) {
  chart.data.datasets.push(dataset);
  chart.update();
}

function removeAllDatasetsExceptBaseline(chart) {
  chart.data.datasets.splice(1);
  chart.update();
}

function valueFromSubOption(subOptionString) {
  return subOptionString.replace('SubOption', '');
}

function cartesianProductOf(...args) {
  const nonEmptyArguments = filter(args, arg => arg.length > 0);

  if (nonEmptyArguments.length === 0) {
    return [];
  }

  return reduce(nonEmptyArguments, (a, b) =>
    flatten(map(a, x => map(b, y => x.concat([y]))), true), [[]]);
}

function buildDatasetWithSeries(labelText, color, dataSeries) {
  return {
    label: labelText,
    fill: false,
    borderColor: COLORS[`${color}-500`],
    pointBackgroundColor: COLORS[`${color}-700`],
    borderWidth: 2,
    data: dataSeries,
  };
}

function normalizedComparisonKey(comparison, metricName) {
  const normalizedKey = comparison.toLowerCase();

  if (metricName === 'revocation_count') {
    if (normalizedKey === 'supervisiontype') {
      return 'admission_reason';
    } else if (normalizedKey === 'revocationtype') {
      return 'revocation_type';
    }
  } else if (metricName === 'admission_count') {
    if (normalizedKey === 'sentencelength') {
      return 'sentence_length_bucket';
    }
  }

  return normalizedKey;
}

function normalizedComparisonValue(comparisonKey, value) {
  let normalizedValue = 'unknown';
  if (value) {
    normalizedValue = value.toLowerCase();
  }

  if (comparisonKey === 'race') {
    if (normalizedValue === 'other') {
      normalizedValue = 'other/hispanic';
    } else if (normalizedValue === 'american_indian_alaskan_native') {
      normalizedValue = 'native_american';
    }
  }

  return normalizedValue;
}

function getDatasetForDriver(normalizedComparison, metricName) {
  if (metricName === 'revocation_count') {
    if (normalizedComparison === 'race') {
      return revocationsByRace;
    } else if (normalizedComparison === 'admission_reason') {
      return revocationsBySupervisionType;
    } else if (normalizedComparison === 'revocation_type') {
      return revocationsByRevocationType;
    }
  } else if (metricName === 'admission_count') {
    if (normalizedComparison === 'race') {
      return reincarcerationsByRace;
    } else if (normalizedComparison === 'gender') {
      return reincarcerationsByGender;
    } else if (normalizedComparison === 'sentence_length_bucket') {
      return reincarcerationsBySentenceLength;
    }
  }

  throw new Error(`Unexpected combination of comparison
    ${normalizedComparison} and metric ${metricName}`);
}

function createDatasetsForDriverChart(comparison, metricName) {
  const datasets = [];

  const normalizedComparison = normalizedComparisonKey(comparison, metricName);
  const dataset = getDatasetForDriver(normalizedComparison, metricName);

  // Group by comparison key, e.g. group races by BLACK, ASIAN, ...
  const datasetsForComparison = dataset.reduce((r, a) => {
    // eslint-disable-next-line no-param-reassign
    r[a[normalizedComparison]] = r[a[normalizedComparison]] || [];
    r[a[normalizedComparison]].push(a);
    return r;
  }, Object.create(null));

  const filteredLines = [];
  Object.keys(datasetsForComparison).forEach((key) => {
    // Normalize fields in data point
    const normalizedLine = datasetsForComparison[key].map((point) => {
      const normalizedPoint = {
        year: parseInt(point.year, 10),
        month: parseInt(point.month, 10),
      };

      normalizedPoint[metricName] = parseInt(point[metricName], 10);
      normalizedPoint[normalizedComparison] =
      normalizedComparisonValue(normalizedComparison, point[normalizedComparison]);
      return normalizedPoint;
    });

    // Filter to visualized window
    const filteredPoints = filter(normalizedLine, point => (point.year === 2018 && point.month > 10)
      || (point.year === 2019 && point.month < 5));

    if (filteredPoints.length === 0) {
      return;
    }

    // Fill gaps with 0s
    const includedMonths = filteredPoints.map(point => point.month);

    [11, 12, 1, 2, 3, 4].forEach((month) => {
      if (!includedMonths.includes(month)) {
        let year = 2018;
        if (month < 11) {
          year = 2019;
        }
        const filledInPoint = {
          year,
          month,
        };
        filledInPoint[metricName] = 0;
        filledInPoint[normalizedComparison] = filteredPoints[0][normalizedComparison];

        filteredPoints.push(filledInPoint);
      }
    });

    filteredPoints.sort((a, b) => a.year - b.year || a.month - b.month);

    filteredLines.push(filteredPoints);
  });

  // Sort the datasets by label
  filteredLines.sort((a, b) => {
    if (a[0][normalizedComparison] < b[0][normalizedComparison]) { return -1; }
    if (a[0][normalizedComparison] > b[0][normalizedComparison]) { return 1; }
    return 0;
  });

  let i = 0;
  filteredLines.forEach((line) => {
    if (!line[0]) {
      return;
    }
    let label = line[0][normalizedComparison];
    if (label == null) {
      return;
    }
    label = normalizeLabel(label);

    const dataSeries = line.map(point => point[metricName]);

    datasets.push(buildDatasetWithSeries(
      label,
      COLOR_ROTATION[i % COLOR_ROTATION.length],
      dataSeries,
    ));
    i += 1;
  });

  return datasets;
}

function recalibrateDatasetsForDriverChart(comparison, metricName, chart) {
  removeAllDatasetsExceptBaseline(chart);

  const datasetsToChart = createDatasetsForDriverChart(comparison, metricName);

  datasetsToChart.forEach((dataset) => {
    addDataset(chart, dataset);
  });
}

function configureDriverRadioButtons(options, moduleType, metricName, chart) {
  options.forEach((comparison) => {
    const radioButton = document.getElementById(`${moduleType}DriverCompareBy${comparison}`);
    radioButton.onchange = function driverButtonRecalibrate() {
      recalibrateDatasetsForDriverChart(comparison, metricName, chart);
    };
  });

  function clearAllComparisons() {
    options.forEach((comparison) => {
      const radioButton = document.getElementById(`${moduleType}DriverCompareBy${comparison}`);
      radioButton.checked = false;
    });

    removeAllDatasetsExceptBaseline(chart);
  }

  const clearButton = document.getElementById(`${moduleType}DriversClearAllComparisons`);
  if (clearButton) {
    clearButton.onclick = clearAllComparisons;
  }
}

function getDatasetForExploration(metricName) {
  if (metricName === 'revocation_count') {
    return revocationExploration;
  } else if (metricName === 'admission_count') {
    return reincarcerationExploration;
  }
  throw Error(`Unexpected metricName for exploration: ${metricName}`);
}

function createDatasetsForExplorationChart(combinations, metricName) {
  const datasets = [];
  const dataset = getDatasetForExploration(metricName);

  // Convert list of combination strings into list of objects
  const comparisons = [];
  combinations.forEach((combo) => {
    const comparisonsForCombo = {};
    combo.forEach((keyValue) => {
      const parts = keyValue.split(':');
      let key = parts[0];
      const value = parts[1];

      key = normalizedComparisonKey(key, metricName);
      comparisonsForCombo[key] = value.toLowerCase();
    });
    comparisons.push(comparisonsForCombo);
  });

  // Group by comparison key
  const datasetsForComparison = {};
  comparisons.forEach((comparison) => {
    const keysInComparison = Object.keys(comparison).concat(['year', 'month', metricName]);

    // Get only those data points that 1) have each key we are filtering on,
    // and 2) don't have any other keys that make them too specific
    const pointsForComparison = dataset.filter((point) => {
      const matchOnKey = Object.keys(comparison).every(key =>
        nullSafeToLowerCase(comparison[key]) === nullSafeToLowerCase(point[key]));

      const noOtherKeys = isEqual(sortBy(Object.keys(point)), sortBy(keysInComparison));
      return matchOnKey && noOtherKeys;
    });

    const comparisonKey = JSON.stringify(comparison);
    datasetsForComparison[comparisonKey] = pointsForComparison;
  });

  const filteredLines = [];
  Object.keys(datasetsForComparison).forEach((key) => {
    const comparison = JSON.parse(key);
    // Normalize fields in data point
    const normalizedLine = datasetsForComparison[key].map((point) => {
      const normalizedPoint = {
        year: parseInt(point.year, 10),
        month: parseInt(point.month, 10),
      };
      normalizedPoint[metricName] = parseInt(point[metricName], 10);

      // Add the comparison parameters back to the data point
      Object.assign(normalizedPoint, comparison);
      return normalizedPoint;
    });

    // Filter to visualized window
    const filteredPoints = filter(normalizedLine, point => (point.year === 2018 && point.month > 10)
      || (point.year === 2019 && point.month < 5));

    if (filteredPoints.length === 0) {
      return;
    }

    // Fill gaps with 0s
    const includedMonths = filteredPoints.map(point => point.month);

    [11, 12, 1, 2, 3, 4].forEach((month) => {
      if (!includedMonths.includes(month)) {
        let year = 2018;
        if (month < 11) {
          year = 2019;
        }
        const filledInPoint = {
          year,
          month,
        };
        filledInPoint[metricName] = 0;

        // Add the comparison parameters back to the data point
        Object.assign(filledInPoint, comparison);
        filteredPoints.push(filledInPoint);
      }
    });

    filteredPoints.sort((a, b) => a.year - b.year || a.month - b.month);

    filteredLines.push(filteredPoints);
  });

  let i = 0;
  filteredLines.forEach((line) => {
    if (!line[0]) {
      return;
    }

    const labelComponents = pickBy(line[0], (value, key) =>
      !['year', 'month', metricName].includes(key));

    const label = normalizeLabel(Object.entries(labelComponents)
      .map(keyValuePair => normalizedComparisonValue(keyValuePair[0], keyValuePair[1]))
      .join(' '));
    if (label == null) {
      return;
    }

    const dataSeries = line.map(point => point[metricName]);

    datasets.push(buildDatasetWithSeries(
      label,
      COLOR_ROTATION[i % COLOR_ROTATION.length],
      dataSeries,
    ));
    i += 1;
  });

  return datasets;
}

function recalibrateDatasetsForExplorationChart(flagsByDimension, dimensions, chart, metricName) {
  const enabledValuesForDimensions = [];
  dimensions.forEach((dimension) => {
    const enabledForDimension = Object.keys(pickBy(flagsByDimension[dimension]))
      .map(key => `${dimension}:${valueFromSubOption(key)}`);
    enabledValuesForDimensions.push(enabledForDimension);
  });

  const combinations = cartesianProductOf(...enabledValuesForDimensions);

  const startDateValue = $('#startDateSelection').val();
  const endDateValue = $('#endDateSelection').val();
  const updatedXTicks = getMonthsBetween(startDateValue, endDateValue);

  // eslint-disable-next-line no-param-reassign
  chart.data.labels = updatedXTicks;

  removeAllDatasetsExceptBaseline(chart);

  if (combinations.length > 0) {
    const datasetsToChart = createDatasetsForExplorationChart(combinations, metricName);

    datasetsToChart.forEach((dataset) => {
      addDataset(chart, dataset);
    });
  }
}

function configureExplorationCheckboxes(flagsByDimension, dimensions, chart, metricName) {
  dimensions.forEach((dimension) => {
    const option = `${dimension}Option`;
    const subOption = `input.${dimension}SubOption`;
    const flags = flagsByDimension[dimension];

    const checkall = document.getElementById(option);
    const checkboxes = document.querySelectorAll(subOption);

    function toggleCheckbox(toggledCheckbox) {
      const optionId = toggledCheckbox.id;
      const enabled = flags[optionId];

      if (enabled) {
        flags[optionId] = false;
      } else {
        flags[optionId] = true;
      }
    }

    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].onclick = function explorationCheckboxRecalibrate() {
        toggleCheckbox(checkboxes[i]);
        recalibrateDatasetsForExplorationChart(flagsByDimension, dimensions, chart, metricName);

        const checkedCount = document.querySelectorAll(`${subOption}:checked`).length;
        if (checkall) {
          checkall.checked = checkedCount > 0;
          checkall.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
      };
    }

    if (checkall) {
      checkall.onclick = function explorationCheckall() {
        for (let i = 0; i < checkboxes.length; i += 1) {
          const checkedBefore = checkboxes[i].checked;
          checkboxes[i].checked = this.checked;
          if (checkedBefore !== this.checked) {
            // Only toggle if there was a change from switching the top-level
            toggleCheckbox(checkboxes[i]);
            recalibrateDatasetsForExplorationChart(
              flagsByDimension, dimensions, chart,
              metricName,
            );
          }
        }
      };
    }
  });
}

export {
  addDataset,
  removeAllDatasetsExceptBaseline,
  valueFromSubOption,
  cartesianProductOf,
  buildDatasetWithSeries,
  configureDriverRadioButtons,
  recalibrateDatasetsForExplorationChart,
  configureExplorationCheckboxes,
};
