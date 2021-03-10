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
function filterDatasetByMetricPeriodMonths(dataset, metricPeriodMonths) {
  return dataset.filter(
    (element) => element.metric_period_months === metricPeriodMonths
  );
}

function filterDatasetByToggleFilters(dataset, toggleFilters) {
  const toggleKey = Object.keys(toggleFilters)[0];
  const toggleValue = toggleFilters[toggleKey].toUpperCase();

  return dataset.filter(
    (element) =>
      String(element[toggleKey]).toUpperCase() === String(toggleValue)
  );
}

function filterDatasetByDistrict(dataset, districts) {
  return dataset.filter((element) =>
    districts
      .map((d) => d.toUpperCase())
      .includes(String(element.district).toUpperCase())
  );
}

function filterDatasetBySupervisionType(dataset, supervisionType) {
  return filterDatasetByToggleFilters(dataset, {
    supervision_type: supervisionType,
  });
}

function filterDatasetByLabels(dataset, label, validLabels) {
  return dataset.filter((element) => validLabels.includes(element[label]));
}

export {
  filterDatasetByMetricPeriodMonths,
  filterDatasetByDistrict,
  filterDatasetBySupervisionType,
  filterDatasetByLabels,
};
