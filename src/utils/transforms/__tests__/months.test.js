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
import tk from 'timekeeper';
import * as monthMethods from '../months';

describe('test for file months', () => {
  const monthNumbers =  ["4", "5", "6", "7", "8", "9", "10", "11", "12", "1", "2", "3"];
  const monthNumbersWithInvalidEntries =  ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "-5", "1", "2", "3"];
  const monthNumbersOutOfOrder =  ["6", "8", "4", "7", "5", "9", "10", "1", "12", "11", "2", "3"];

  it('get current month name', () => {
    const testDate = new Date('2020-02-14T11:01:58.135Z');
    tk.freeze(testDate);

    const currentMonthName = monthMethods.getCurrentMonthName();
    expect(currentMonthName).toEqual('February');
  });

  it('get short name of month', () => {
    const monthNames = monthMethods.monthNameFromNumberAbbreviated(3);
    expect(monthNames).toEqual('Mar');

    const monthNamesZeroNumber = monthMethods.monthNameFromNumberAbbreviated(0);
    expect(monthNamesZeroNumber).toBe(undefined);

    const monthNamesBigNumber = monthMethods.monthNameFromNumberAbbreviated(15);
    expect(monthNamesBigNumber).toBe(undefined);

    const monthNameStringNumber = monthMethods.monthNameFromNumberAbbreviated('test');
    expect(monthNameStringNumber).toBe(undefined);
  });

  it('get month name by number', () => {
    const monthNameFromNumber = monthMethods.monthNameFromNumber(9);
    expect(monthNameFromNumber).toEqual('September');

    const monthNameFromUndefinedNumber = monthMethods.monthNameFromNumber(undefined);
    expect(monthNameFromUndefinedNumber).toBe(undefined);

    const monthNameFromZeroNumber = monthMethods.monthNameFromNumber(0);
    expect(monthNameFromZeroNumber).toBe(undefined);

    const monthNameFromWrongNumber = monthMethods.monthNameFromNumber(13);
    expect(monthNameFromWrongNumber).toEqual(undefined);
  });

  it('month names from numbers', () => {
    const expectedForAbbreviated = [
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar'
    ];
    const expectedMonthNames = [
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
      'January',
      'February',
      'March'
    ];

    const expectedForWrongNumbers =  [
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      undefined,
      undefined,
      'Jan',
      'Feb',
      'Mar'
    ];

    const monthNamesWithAbbreviated = monthMethods.monthNamesFromNumbers(monthNumbers, true);
    expect(monthNamesWithAbbreviated).toEqual(expectedForAbbreviated);

    const monthNamesWithoutAbbreviated = monthMethods.monthNamesFromNumbers(monthNumbers, false);
    expect(monthNamesWithoutAbbreviated).toEqual(expectedMonthNames);

    const monthNamesEmptyArray = monthMethods.monthNamesFromNumbers([], undefined);
    expect(monthNamesEmptyArray).toEqual([]);

    const monthNamesWrongNumber = monthMethods.monthNamesFromNumbers(monthNumbersWithInvalidEntries, true);
    expect(monthNamesWrongNumber).toEqual(expectedForWrongNumbers);
  });

  it('month names all with years from numbers', () => {
    const dataExpected = [
      "Apr '19",
      "May '19",
      "Jun '19",
      "Jul '19",
      "Aug '19",
      "Sep '19",
      "Oct '19",
      "Nov '19",
      "Dec '19",
      "Jan '20",
      "Feb '20",
      "Mar '20"
    ];

    const expectedForDifferentOrder = [
      "Jun '19",
      "Aug '19",
      "Apr '19",
      "Jul '19",
      "May '19",
      "Sep '19",
      "Oct '19",
      "Jan '20",
      "Dec '20",
      "Nov '20",
      "Feb '20",
      "Mar '20"
    ];
    const expectedForLongArray = [
      "Apr '19",
      "May '19",
      "Jun '19",
      "Jul '19",
      "Aug '19",
      "Sep '19",
      "Oct '19",
      "Nov '19",
      "Dec '19",
      "Jan '20",
      "Feb '20",
      "Mar '20",
      "Apr '20"
    ];
    const longArray =["4", "5", "6", "7", "8", "9", "10", "11", "12", "1", "2", "3", "4"];

    const monthNamesWithYears = monthMethods.monthNamesAllWithYearsFromNumbers(monthNumbers, true);
    expect(monthNamesWithYears).toEqual(dataExpected);

    const monthNamesWithYearsDifferentOrderArray = monthMethods.monthNamesAllWithYearsFromNumbers(monthNumbersOutOfOrder, true);
    expect(monthNamesWithYearsDifferentOrderArray).toEqual(expectedForDifferentOrder);

    const monthNamesWithYearsEmptyArray = monthMethods.monthNamesAllWithYearsFromNumbers([], undefined);
    expect(monthNamesWithYearsEmptyArray).toEqual([]);

    const monthNamesWithYearsSmallArray = monthMethods.monthNamesAllWithYearsFromNumbers(longArray, true);
    expect(monthNamesWithYearsSmallArray).toEqual(expectedForLongArray);
  });

  it('month names with years from numbers', () => {
    const dataExpected = [
      "Apr '19",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan '20",
      "Feb",
      "Mar"
    ];
    const dataExpectedLongArray = [
      "Apr '19",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      undefined,
      undefined,
      "Jan '20",
      "Feb",
      "Mar"
    ];
    const dataExpectedDifferentOrderArray =[
      "Jun '19",
      "Aug",
      "Apr",
      "Jul",
      "May",
      "Sep",
      "Oct",
      "Jan '20",
      "Dec",
      "Nov",
      "Feb",
      "Mar"
    ];

    const monthNamesWithYears = monthMethods.monthNamesWithYearsFromNumbers(monthNumbers, true);
    expect(monthNamesWithYears).toEqual(dataExpected);

    const monthNamesWithYearsEmptyArray = monthMethods.monthNamesWithYearsFromNumbers([], undefined);
    expect(monthNamesWithYearsEmptyArray).toEqual([]);

    const monthNamesWithYearsLongArray = monthMethods.monthNamesWithYearsFromNumbers(monthNumbersWithInvalidEntries, true);
    expect(monthNamesWithYearsLongArray).toEqual(dataExpectedLongArray);

    const monthNamesWithYearsDifferentOrderArray = monthMethods.monthNamesWithYearsFromNumbers(monthNumbersOutOfOrder, true);
    expect(monthNamesWithYearsDifferentOrderArray).toEqual(dataExpectedDifferentOrderArray);
  });

  it('month names from short name', () => {
    const monthFromShortName = monthMethods.monthNamesFromShortName("Jan '20");
    expect(monthFromShortName).toEqual('January');

    const monthFromLongName = monthMethods.monthNamesFromShortName("April '19");
    expect(monthFromLongName).toEqual(undefined);

    const monthFromEmptyName = monthMethods.monthNamesFromShortName(" ");
    expect(monthFromEmptyName).toBe(undefined);
  });

  it('month names all with years from wrong numbers', () => {
    const testData = ['4', '5', '6', '7', '13', '-1', '2', '3', '4'];
    expect(() => {
      monthMethods.monthNamesAllWithYearsFromNumbers(testData, true, false);
    }).toThrow();
  });
});
