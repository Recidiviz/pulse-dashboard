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

import { getBarChartDefinition } from './RevocationCountByOfficer';
import { testGetBarChartDefinitionAgainstSnapshots } from './test_utils/snapshotTesting'

const fs = require('fs');
const path = require('path');

const data = readJsonLinesFile(
    path.join(__dirname, 'test_data/RevocationCountByOfficer/revocations_by_officer_by_period.json')
);

testGetBarChartDefinitionAgainstSnapshots(
    path.join(__dirname, 'test_data/RevocationCountByOfficer/snapshots'),
    getBarChartDefinition,
    {
      revocationCountsByOfficer: data,
      officeData: readJsonLinesFile(path.join(__dirname, 'test_data/RevocationCountByOfficer/site_offices.json'))
    }
);
