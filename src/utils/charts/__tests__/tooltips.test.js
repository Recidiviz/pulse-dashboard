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
import * as tooltipsMethods from '../tooltips';

describe('test for tooltips', () => {
  const tooltipItem = [
    {
      xLabel: "Black",
      yLabel: 107,
      label: "Black",
      value: "107",
      index: 2,
      datasetIndex: 0,
      x: 255.5001397650583,
      y: 185.55155917203672
    }, {
      xLabel: "Hispanic",
      yLabel: 152,
      label: "Hispanic",
      value: "152",
      index: 4,
      datasetIndex: 2,
      x: 375.09584281376425,
      y: 171.9262300611739
    }
  ];

  const data = {
    labels: ['American Indian Alaskan Native', 'Asian', 'Black', 'Hispanic', 'Native Hawaiian Pacific Islander', 'Other'],
    datasets: [
      {
        label: "Referrals",
        backgroundColor: "#809AE5",
        hoverBackgroundColor: "#809AE5",
        yAxisID: "y-axis-left",
        data: [478, 0, 107, 0, 42, 52, 609]
      }, {
        label: "Supervision Population",
        backgroundColor: "#3F4D62",
        hoverBackgroundColor: "#3F4D62",
        yAxisID: "y-axis-left",
        data: [301, 0, 71, 152, 31, 55, 559]
      }, {
        label: "Population",
        backgroundColor: "#3F4D62",
        hoverBackgroundColor: "#3F4D62",
        yAxisID: "y-axis-left",
        data: [301, 0, 71, 152, 31, 55, 559]
      }
    ]
  };

  it('tooltip for count chart', () => {
    const firstDataset = [456, 789, 56, 789];
    const firstPrefix = 'Referral';
    const secondDataset = [23, 50, 200, 89];
    const secondPrefix = 'Supervision';

    const dataEmpty = {
      labels: { Referrals: '' },
      datasets: [ ]
    };
    const dataForFirstDataset = {
      labels: { Referrals: 'test' },
      datasets: [
        {
          label: 'Referral',
          data: {
            Referrals: 20.560109289617486
          },
        }
      ]
    };

    const dataForSecondDataset = {
      labels: { Supervision: 'test' },
      datasets: [
        {
          label: 'Supervision',
          data: {
            Referrals: 20.560109289617486
          },
        }
      ]
    };

    const callback = tooltipsMethods.tooltipForCountChart(firstDataset, firstPrefix, secondDataset, secondPrefix);
    const tooltipTitle = callback.title(tooltipItem, data);
    expect(tooltipTitle).toBe('Black');

    const tooltipLabelForFirstDataset = callback.label(tooltipItem[0], dataForFirstDataset);
    expect(tooltipLabelForFirstDataset).toBe('Referral: 56');

    const tooltipLabelForSecondDataset = callback.label(tooltipItem[0], dataForSecondDataset);
    expect(tooltipLabelForSecondDataset).toBe('Supervision: 200');

    const tooltipLabel = callback.label(tooltipItem[1], data);
    expect(tooltipLabel).toBe('Population: 0');

    const tooltipEmptyTitle = callback.title(tooltipItem, dataEmpty);
    expect(tooltipEmptyTitle).toBe(undefined);

    const tooltipEmptyLabel = callback.label(tooltipItem[0], dataEmpty);
    expect(tooltipEmptyLabel).toEqual(': 0');

  });

  it('tooltip for rate chart', () => {
    const dataWithEmptyLabel = {
      labels: { Referrals: 'test' },
      datasets: [
        {
          label: '',
          data: {
            Referrals: ''
          },
        }
      ]
    };

    const callback = tooltipsMethods.tooltipForRateChart();

    const tooltipTitle = callback.title(tooltipItem, data);
    expect(tooltipTitle).toBe('Referrals');

    const labelTooltip = callback.label(tooltipItem[0], data);
    expect(labelTooltip).toBe('107.00% of Black');

    const tooltipEmptyTitle = callback.title(tooltipItem, dataWithEmptyLabel);
    expect(tooltipEmptyTitle).toBe('');
  });

});
