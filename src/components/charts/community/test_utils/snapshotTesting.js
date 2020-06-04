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

const fs = require('fs');
const path = require('path');

const AdmZip = require('adm-zip');

export const testGetBarChartDefinitionAgainstSnapshots = (
    snapshotsDir,
    getBarChartDefinition,
    argumentsOtherThanFilters,
    modifyExpectedDefinition) => {
  describe('getBarChartDefinition', () => {
    const ActualDate = Date;
    const mockNow = '2020-03-07T23:00:00';

    beforeAll(() => {
      Date = class extends Date {
        constructor() {
          return new ActualDate(mockNow);
        }
      };
    });

    afterAll(() => {
      Date = ActualDate;
    });

    test('produces the expected chart definitions for all snapshotted scenarios', () => {
      if (fs.existsSync(`${snapshotsDir}.zip`)) {
        const zip = new AdmZip(`${snapshotsDir}.zip`);
        zip.extractAllTo(path.join(snapshotsDir, '..'));
      }

      fs.readdirSync(snapshotsDir).forEach(fileName => {
        try {
          const filters = fileName.slice(0, 0 - '.json'.length).split('_').reduce((filters, part) => {
            const [name, value] = part.split('-');

            filters[name] = value;

            return filters;
          }, {});

          const expectedDefinition = JSON.parse(fs.readFileSync(path.join(snapshotsDir, fileName), 'utf8'));

          if (modifyExpectedDefinition) modifyExpectedDefinition(expectedDefinition);

          let definition = getBarChartDefinition(Object.assign(filters, argumentsOtherThanFilters));

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
};
