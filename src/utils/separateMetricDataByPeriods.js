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

import { LESS_THEN_3_YEARS, THREE_YEARS } from "../hooks/useChartData";

const separateMetricFilesByPeriods = (metricFiles) => {
  const separatedMetricFiles = {
    [THREE_YEARS]: {},
    [LESS_THEN_3_YEARS]: {},
  };
  Object.entries(metricFiles).forEach(([metricFileName, metricFile]) => {
    const separatedMetricFile = metricFile.reduce(
      (acc, item) => {
        acc[
          parseInt(item.metric_period_months) === 36
            ? THREE_YEARS
            : LESS_THEN_3_YEARS
        ].push(item);
        return acc;
      },
      { [THREE_YEARS]: [], [LESS_THEN_3_YEARS]: [] }
    );

    separatedMetricFiles[THREE_YEARS][metricFileName] =
      separatedMetricFile[THREE_YEARS];
    separatedMetricFiles[LESS_THEN_3_YEARS][metricFileName] =
      separatedMetricFile[LESS_THEN_3_YEARS];
  });

  return separatedMetricFiles;
};

export default separateMetricFilesByPeriods;
