/* Ad-hoc script for creating snapshots of charts with every available filter combination. */

import { readJsonLinesFile } from '../../../../utils/testing';

import * as revocationCountBySupervisionType from '../RevocationCountBySupervisionType';
import * as revocationCountByViolationType from '../RevocationCountByViolationType';

const fs = require('fs');
const path = require('path');

const charts = [
  {
    dir: 'RevocationCountBySupervisionType',
    chartDefinitionFn: revocationCountBySupervisionType.getBarChartDefinition,
    sampleData: readJsonLinesFile(
        path.join(__dirname, 'RevocationCountBySupervisionType/revocations_by_supervision_type_by_month.json')
    ),
    dataArg: 'revocationCountsByMonthBySupervisionType'
  },
  {
    dir: 'RevocationCountByViolationType',
    chartDefinitionFn: revocationCountByViolationType.getBarChartDefinition,
    sampleData: readJsonLinesFile(
        path.join(__dirname, 'RevocationCountByViolationType/revocations_by_violation_type_by_month.json')
    ),
    dataArg: 'revocationCountsByMonthByViolationType'
  }
];

const filterOptions = {
  metricType: ['counts', 'rates'],
  metricPeriodMonths: ['36', '12', '6', '3', '1'],
  supervisionType: ['all', 'probation', 'parole'],
  district: [
    'all', 'beulah', 'bismarck', 'bottineau', 'devils-lake', 'dickson', 'fargo', 'grafton', 'grand-forks',
    'jamestown', 'mandan', 'minot', 'oakes', 'rolla', 'washburn', 'wahpeton', 'williston'
  ]
};

const filters = Object.keys(filterOptions);

const getAllFilterCombos = (filters) => {
  const filterOptionsForCurrentFilter = filterOptions[filters[0]].map(filterOption => ({[filters[0]]: filterOption}));
  if (filters.length == 1) {
    return filterOptionsForCurrentFilter;
  } else {
    var combos = [];

    var allCombosForOtherFilters = getAllFilterCombos(filters.slice(1));

    for (let combo of allCombosForOtherFilters) {
      for (let option of filterOptionsForCurrentFilter) {
        combos.push(Object.assign({}, combo, option));
      }
    }

    return combos;
  }
};

const writeDefinition = (chart, filterCombo, definition) => {
  const fileName = filters.map(filter => `${filter}:${filterCombo[filter]}`).join('|');

  fs.writeFileSync(
      path.join(__dirname, chart.dir, 'snapshots', `${fileName}.json`),
      JSON.stringify(definition, null, 2)
  );
};

// This is jankily run as a Jest test because it's the quickest way I know of to run code that supports both node
// APIs and all the packages used in the app.
test('run', () => {
  const allCombos = getAllFilterCombos(filters);

  charts.forEach(chart => {
    allCombos.forEach(combo => {
      const result = chart.chartDefinitionFn(Object.assign(combo, {[chart.dataArg]: chart.sampleData}));

      writeDefinition(chart, combo, result);
    });
  })
});
