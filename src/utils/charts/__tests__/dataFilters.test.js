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

import '@testing-library/jest-dom/extend-expect';
import * as filterMethods from '../dataFilters';
import tk from 'timekeeper';

describe('test for dataFilters toggle functions', () => {
  it('filters dataset by metric period months', () => {
    const dataset = [
      {
        supervision_type: 'ALL',
        district: 'ALL',
        state_code: 'US_DEMO',
        metric_period_months: '3',
        new_admissions: '190',
        technicals: '138',
        non_technicals: '115',
        unknown_revocations: '46'
      }, {
        supervision_type: 'ALL',
        district: 'ALL',
        state_code: 'US_DEMO',
        metric_period_months: '1',
        new_admissions: '84',
        technicals: '50',
        non_technicals: '65',
        unknown_revocations: '26',
      }
    ];

    const expectedFilterDataset =  [
      {
        supervision_type: 'ALL',
        district: 'ALL',
        state_code: 'US_DEMO',
        metric_period_months: '1',
        new_admissions: '84',
        technicals: '50',
        non_technicals: '65',
        unknown_revocations: '26'
      }
    ];

    const filterDataset = filterMethods.filterDatasetByMetricPeriodMonths(dataset, '1');
    expect(filterDataset).toEqual(expectedFilterDataset);

    const filterEmptyDataset = filterMethods.filterDatasetByMetricPeriodMonths([], 0);
    expect(filterEmptyDataset).toEqual([]);

    const filterDatasetPeriodIsNotExist = filterMethods.filterDatasetByMetricPeriodMonths([], 4);
    expect(filterDatasetPeriodIsNotExist).toEqual([]);
  });

  it('filters dataset by supervision type', () => {
    const dataset = [
      {
        supervision_type: "PAROLE",
        district: "ALL",
        state_code: "US_DEMO",
        metric_period_months: "1",
        new_admissions: "32",
        technicals: "20",
        non_technicals: "30",
        unknown_revocations: "12"
      },
      {
        supervision_type: "PROBATION",
        district: "ALL",
        state_code: "US_DEMO",
        metric_period_months: "3",
        new_admissions: "85",
        technicals: "64",
        non_technicals: "55",
        unknown_revocations: "22"
      },
      {
        supervision_type: "PAROLE",
        district: "No",
        state_code: "US_DEMO",
        metric_period_months: "6",
        new_admissions: "141",
        technicals: "109",
        non_technicals: "91",
        unknown_revocations: "37"
      }
    ];

    const expectedFilterDataset = [
      {
        supervision_type: 'PAROLE',
        district: 'ALL',
        state_code: 'US_DEMO',
        metric_period_months: '1',
        new_admissions: '32',
        technicals: '20',
        non_technicals: '30',
        unknown_revocations: '12'
      },
      {
        supervision_type: 'PAROLE',
        district: 'No',
        state_code: 'US_DEMO',
        metric_period_months: '6',
        new_admissions: '141',
        technicals: '109',
        non_technicals: '91',
        unknown_revocations: '37'
      }
    ];

    const filterDataset = filterMethods.filterDatasetBySupervisionType(dataset, 'PAROLE');
    expect(filterDataset).toEqual(expectedFilterDataset);
  });

  it('filters dataset by district', () => {
    const district = ['all'];

    const dataset = [
      {
        supervision_type: "PAROLE",
        district: ["all"],
        state_code: "US_DEMO",
        metric_period_months: "1",
        new_admissions: "32",
        technicals: "20",
        non_technicals: "30",
        unknown_revocations: "12"
      },
      {
        supervision_type: "PAROLE",
        district: ["No"],
        state_code: "US_DEMO",
        metric_period_months: "6",
        new_admissions: "141",
        technicals: "109",
        non_technicals: "91",
        unknown_revocations: "37"
      }
    ];

    const expectedToggleFiltersTest =  [
      {
        supervision_type: 'PAROLE',
        district: ['all'],
        state_code: 'US_DEMO',
        metric_period_months: '1',
        new_admissions: '32',
        technicals: '20',
        non_technicals: '30',
        unknown_revocations: '12'
      }
    ];

    const toggleFiltersTest = filterMethods.filterDatasetByDistrict(dataset, district);
    expect(toggleFiltersTest).toEqual(expectedToggleFiltersTest);
  });
});

describe('test for filterOptimizedDataFormat', () => {
  const metadata = {
    total_data_points: "11",
    value_keys: ["total_revocations"],
    dimension_manifest: [
      ["district", ["4", "5", "6"]],
      ["month", ["11", "12"]],
      ["supervision_type", ["parole", "probation"]],
      ["year", ["2020"]],
    ],
  };

  const unflattenedValues = [
    ['0','0','1','1','2','0','0','1','1','2','2'],
    ['0','0','0','0','0','1','1','1','1','1','1'],
    ['0','1','0','1','0','0','1','0','1','0','1'],
    ['0','0','0','0','0','0','0','0','0','0','0'],
    ['100','68','73','41','10','30','36','51','38','15','4'],
  ];

  const fullOutput = [
    {
      district: "4",
      year: "2020",
      month: "11",
      supervision_type: "PAROLE",
      total_revocations: "100",
    },
    {
      district: "4",
      year: "2020",
      month: "11",
      supervision_type: "PROBATION",
      total_revocations: "68",
    },
    {
      district: "5",
      year: "2020",
      month: "11",
      supervision_type: "PAROLE",
      total_revocations: "73",
    },
    {
      district: "5",
      year: "2020",
      month: "11",
      supervision_type: "PROBATION",
      total_revocations: "41",
    },
    {
      district: "6",
      year: "2020",
      month: "11",
      supervision_type: "PAROLE",
      total_revocations: "10",
    },
    {
      district: "4",
      year: "2020",
      month: "12",
      supervision_type: "PAROLE",
      total_revocations: "30",
    },
    {
      district: "4",
      year: "2020",
      month: "12",
      supervision_type: "PROBATION",
      total_revocations: "36",
    },
    {
      district: "5",
      year: "2020",
      month: "12",
      supervision_type: "PAROLE",
      total_revocations: "51",
    },
    {
      district: "5",
      year: "2020",
      month: "12",
      supervision_type: "PROBATION",
      total_revocations: "38",
    },
    {
      district: "6",
      year: "2020",
      month: "12",
      supervision_type: "PAROLE",
      total_revocations: "15",
    },
    {
      district: "6",
      year: "2020",
      month: "12",
      supervision_type: "PROBATION",
      total_revocations: "4",
    },
  ];

  it('correctly parses data points, regardless of filtering', () => {
    const filtered = filterMethods.filterOptimizedDataFormat(
      unflattenedValues,
      metadata,
      () => true,
    );
    expect(filtered).toEqual(fullOutput);
  });

  it('correctly parses and filter data points', () => {
    const filtered = filterMethods.filterOptimizedDataFormat(
      unflattenedValues,
      metadata,
      (item, dimensionKey) => dimensionKey !== 'supervision_type' || item.supervision_type.toUpperCase() === 'PAROLE',
    );

    const expected = [
      fullOutput[0],
      fullOutput[2],
      fullOutput[4],
      fullOutput[5],
      fullOutput[7],
      fullOutput[9],
    ];
    expect(filtered).toEqual(expected);
  });

  it('correctly parses and filter data points with multiple filters', () => {
    const filtered = filterMethods.filterOptimizedDataFormat(
      unflattenedValues,
      metadata,
      (item, dimensionKey) => {
        if (dimensionKey === 'supervision_type') {
          return item.supervision_type.toUpperCase() === 'PAROLE';
        } else if (dimensionKey === 'month') {
          return item.month === '11';
        }
        return true;
      },
    );

    const expected = [
      fullOutput[0],
      fullOutput[2],
      fullOutput[4],
    ];
    expect(filtered).toEqual(expected);
  });

  it('correctly returns an empty list with a falsey filter', () => {
    const filtered = filterMethods.filterOptimizedDataFormat(
      unflattenedValues,
      metadata,
      () => false,
    );

    expect(filtered).toEqual([]);
  });
});
