// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2018 Recidiviz, Inc.
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

import moment from 'moment';

function timeStamp() {
  const now = new Date();
  const date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
  const time = [now.getHours(), now.getMinutes(), now.getSeconds()];
  const suffix = (time[0] < 12) ? 'AM' : 'PM';

  time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
  time[0] = time[0] || 12;

  for (let i = 1; i < 3; i += 1) {
    if (time[i] < 10) {
      time[i] = `0${time[i]}`;
    }
  }
  return `${date.join('-')}-${time.join('-')}-${suffix}`;
}

function getMonthsBetween(startDateValue, endDateValue) {
  const startDate = moment(startDateValue);
  const endDate = moment(endDateValue);
  const months = [];

  while (!startDate.isAfter(endDate)) {
    months.push(startDate.format('MMMM'));
    startDate.add(1, 'month');
  }
  return months;
}

export {
  timeStamp,
  getMonthsBetween,
};
