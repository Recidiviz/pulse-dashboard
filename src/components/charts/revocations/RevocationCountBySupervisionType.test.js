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

import { readJsonLinesFile } from '../../../utils/testing';

import { getBarChartDefinition } from './RevocationCountBySupervisionType';
import { testGetBarChartDefinitionAgainstSnapshots } from './test_utils/snapshotTesting'

const fs = require('fs');
const path = require('path');

/**
 * Function that modifies a snapshotted definition to conform to minor changes made since snapshot was created.
 */
const modifyExpectedDefinition = (expectedDefinition) => {
  expectedDefinition.data.datasets.forEach(dataset => {
    delete dataset['type'];
  });
  
  expectedDefinition.options.legend.boxWidth = 10;

  // Ensure numbers are always numbers and not stringified numbers
  expectedDefinition.data.datasets.forEach(dataset => {
    dataset.data = dataset.data.map(val => Number(val));
  });
};

const data = readJsonLinesFile(
    path.join(__dirname, 'test_data/RevocationCountBySupervisionType/revocations_by_supervision_type_by_month.json')
);

testGetBarChartDefinitionAgainstSnapshots(
    path.join(__dirname, 'test_data/RevocationCountBySupervisionType/snapshots'),
    getBarChartDefinition,
    {revocationCountsByMonthBySupervisionType: data},
    modifyExpectedDefinition,
);
