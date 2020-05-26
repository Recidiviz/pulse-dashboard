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

import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  format,
} from "date-fns";

const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

export function createStaticRanges(ranges) {
  return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
}

export const defaultStaticRanges = createStaticRanges([
  {
    label: "Today",
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -1)),
      endDate: endOfDay(addDays(new Date(), -1)),
    }),
  },

  {
    label: "This Week",
    range: () => ({
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
    }),
  },
  {
    label: "Last Week",
    range: () => ({
      startDate: startOfWeek(addDays(new Date(), -7)),
      endDate: endOfWeek(addDays(new Date(), -7)),
    }),
  },
  {
    label: "This Month",
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last Month",
    range: () => ({
      startDate: startOfMonth(addMonths(new Date(), -1)),
      endDate: endOfMonth(addMonths(new Date(), -1)),
    }),
  },
  {
    label: "Last 3 Months",
    range: () => ({
      startDate: startOfMonth(addMonths(new Date(), -3)),
      endDate: endOfMonth(addMonths(new Date(), -3)),
    }),
  },
  {
    label: "Last 6 Months",
    range: () => ({
      startDate: startOfMonth(addMonths(new Date(), -6)),
      endDate: endOfMonth(addMonths(new Date(), -6)),
    }),
  },
]);

export function formatRange(range) {
  const preset = defaultStaticRanges.find((staticRange) =>
    staticRange.isSelected(range)
  );

  if (preset) return preset.label;

  const startDate = range.startDate
    ? format(range.startDate, "MMMM d, yyyy")
    : "";
  const endDate = range.endDate ? format(range.endDate, "MMMM d, yyyy") : "now";

  return `${startDate} to ${endDate}`;
}
