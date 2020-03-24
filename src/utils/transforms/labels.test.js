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
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import * as labelsMethods from './labels';

describe('test label', () => {

 it('get gender from array genderValuetoLabel', () => {
   const testValueGender = 'FEMALE';
   const dataAfterTest = labelsMethods.genderValueToHumanReadable(testValueGender);
   expect(dataAfterTest).toBe('Female');

   const dataErrorAfterTest = labelsMethods.genderValueToHumanReadable('White');
   expect(dataErrorAfterTest).toBe(undefined);
 });

 it('get race from  array raceValuetoLabel', () => {
   const testValueRace = 'WHITE';
   const dataAfterTest = labelsMethods.raceValueToHumanReadable(testValueRace);
   expect(dataAfterTest).toBe('White');
 });

 it('to Html friendly', () => {
   const dataAfterTest = labelsMethods.toHtmlFriendly('Los Angeles');
   expect(dataAfterTest.toString()).toEqual('Los-Angeles');
 });

 it('to human readable', () => {
   const dataAfterTest = labelsMethods.toHumanReadable('Los-Angeles');
   expect(dataAfterTest.toString()).toEqual('Los Angeles');
 });

 it('toInt', () => {
  const dataForTest = '999: Lavena Banbridge';
  const dataAfterTest = labelsMethods.toInt(dataForTest);
  expect(dataAfterTest).toBe(999);

  const dataErrorAfterTest = labelsMethods.toInt('Banbridge');
  expect(dataErrorAfterTest).toBe(NaN);
 });

 it('to title case', () => {
   const dataForTest = 'LOS ANGELES';
   const dataAfterTest = labelsMethods.toTitleCase(dataForTest);
   expect(dataAfterTest).toEqual('Los Angeles');

   const dataErrorAfterTest = labelsMethods.toTitleCase('');
   expect(dataErrorAfterTest).toEqual('');
 });

 it('human readable title case', () => {
   const dataForTesting = 'SAN FRANCISCO CALIFORNIA';
   const dataAfterTest = labelsMethods.humanReadableTitleCase(dataForTesting);
   expect(dataAfterTest).toEqual('San Francisco California');
 });

 it('number from officer id', () => {
   const dataForTest = '27: Patricia Mayonnaise';
   const dataAfterTest = labelsMethods.numberFromOfficerId(dataForTest);
   expect(dataAfterTest).toBe(27);
 });

 it('nameFromOfficerId', () => {
   const dataForTest = '104: Mike Giacobbo';
   const dataAfterTest = labelsMethods.nameFromOfficerId(dataForTest);
   const dataExpected = 'Mike Giacobbo';
   expect(dataAfterTest).toEqual(dataExpected);
 });

});
