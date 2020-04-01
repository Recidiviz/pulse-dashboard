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

import parseViolationRecord from '../parseViolationRecord';

describe('parseViolationRecord function', () => {
  test('reformats semicolon-separated strings', () => {
    const rawInput = '1fel;1muni;4subs;3tech';
    const expectedOutput = '1 fel, 1 muni, 4 subs, 3 tech';
    expect(parseViolationRecord(rawInput)).toBe(expectedOutput);
  });
  test('returns a string even when there is no input', () => {
    expect(parseViolationRecord()).toBe('');
    expect(parseViolationRecord('')).toBe('');
    expect(parseViolationRecord(null)).toBe('');
  });
  test('handles multi-digit violation counts', () => {
    const rawInput = '1fel;13muni;400subs';
    const expectedOutput = '1 fel, 13 muni, 400 subs';
    expect(parseViolationRecord(rawInput)).toBe(expectedOutput);
  });
});
