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
export function standardTooltipForCountMetric(tooltipItem, data) {
  let label = data.datasets[tooltipItem.datasetIndex].label || "";

  // The below logic is the default tooltip logic for ChartJS 2
  if (label) {
    label += ": ";
  }

  if (tooltipItem.value) {
    label += tooltipItem.value;
  } else {
    label += tooltipItem.yLabel;
  }

  return label;
}

/**
 * Returns the string value for a tooltip that excludes information about
 * trendline data points.
 * Appends the `units` string to the data yLabel value if provided.
 */
export function getTooltipWithoutTrendline(tooltipItem, data, units) {
  const { label } = data.datasets[tooltipItem.datasetIndex];
  if (label === "trendline") return "";
  let tooltipLabel = tooltipItem.yLabel.toString();
  if (units) {
    tooltipLabel = tooltipLabel.concat(units);
  }

  return tooltipLabel;
}
