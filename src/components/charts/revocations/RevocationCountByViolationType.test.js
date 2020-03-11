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

import { getBarChartDefinition } from './RevocationCountByViolationType';

const fs = require('fs');
const path = require('path');

describe('getBarChartDefinition', () => {
  const data = readJsonLinesFile(
      path.join(__dirname, 'test_data/RevocationCountByViolationType/revocations_by_violation_type_by_month.json')
  );

  test('produces the expected chart definitions for all snapshotted scenarios', () => {
    fs.readdirSync(path.join(__dirname, 'test_data/RevocationCountByViolationType/snapshots')).forEach(fileName => {
      try {
        const filters = fileName.slice(0, 0 - '.json'.length).split('|').reduce((filters, part) => {
          const [name, value] = part.split(':');

          filters[name] = value;

          return filters;
        }, {});

        const expectedDefinition = JSON.parse(fs.readFileSync(
            path.join(__dirname, 'test_data/RevocationCountByViolationType/snapshots', fileName),
            'utf8'
        ));

        let definition = getBarChartDefinition(Object.assign(filters, {revocationCountsByMonthByViolationType: data}));

        // serialize and deserialize to effectively ignore embedded functions for now (less critical than the data)
        definition = JSON.parse(JSON.stringify(definition));
        
        expect(definition).toEqual(expectedDefinition);
      } catch (e) {
        console.log(`Error for snapshot in ${fileName}`);

        throw e;
      }
    });
  });
});
