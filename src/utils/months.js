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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_NAMES_ABBREVIATED = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthNamesFromNumbers = function monthNamesFromNumbers(
  monthNumbers,
  abbreviated
) {
  const monthList = [];
  const namesArray = abbreviated ? MONTH_NAMES_ABBREVIATED : MONTH_NAMES;

  monthNumbers.forEach((month) => {
    monthList.push(namesArray[month - 1]);
  });

  return monthList;
};

const monthNamesWithYears = function monthNamesWithyears(
  monthNumbers,
  abbreviated,
  allMonths
) {
  const monthNames = monthNamesFromNumbers(monthNumbers, abbreviated);
  const monthNumbersNormalized = monthNumbers.map((month) => Number(month));
  const multipleYears =
    monthNumbersNormalized.length > 12 ||
    monthNumbersNormalized[monthNumbersNormalized.length - 1] <
      monthNumbersNormalized[0];
  const january = abbreviated ? "Jan" : "January";

  const today = new Date();
  let year = today.getFullYear();

  for (let i = monthNumbers.length - 1; i >= 0; i -= 1) {
    if (i === 0) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
    } else if (multipleYears && monthNames[i] === january) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
      year -= 1;
    } else if (allMonths) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
    }
  }
  return monthNames;
};

export { MONTH_NAMES, monthNamesWithYears, monthNamesFromNumbers };
