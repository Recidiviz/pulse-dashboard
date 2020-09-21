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


const nullSafeComparison = (field, filter) => {
  if (!field && !filter) return true;
  if (!field) return false;
  if (!filter) return false;
  return field.toLowerCase() === filter.toLowerCase();
};

const nullSafeComparisonForArray = (field, filters) => {
  if (!field && !filters) return true;
  if (!field) return false;
  if (!filters) return false;
  return (
    filters.filter((value) => value.toLowerCase() === field.toLowerCase())
      .length !== 0
  );
};

const isAllItem = (item) => item.toLowerCase() === "all";

const includesAllItemFirst = (items) => {
  return items.length === 1 && isAllItem(items[0]);
};

export {
  nullSafeComparison,
  nullSafeComparisonForArray,
  isAllItem,
  includesAllItemFirst,
};
