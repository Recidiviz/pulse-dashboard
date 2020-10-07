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
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
} from "../../../../utils/charts/toggles";
import {
  formatSelectOptionValue,
  excludeOption,
  flatOptions,
} from "../../../controls/utils";

export const getTimeDescription = (months, admissionOptions, admissionType) => {
  const trailingLabel = getTrailingLabelFromMetricPeriodMonthsToggle(months);
  const periodLabel = getPeriodLabelFromMetricPeriodMonthsToggle(months);

  if (!admissionType) {
    return `${trailingLabel} (${periodLabel})`;
  }

  const admissionTypeOptions = excludeOption(
    flatOptions(admissionOptions),
    admissionOptions[0]
  ).filter((ao) => admissionType.includes(ao.value));
  const admissionFilter = formatSelectOptionValue(
    admissionOptions,
    admissionOptions[0],
    admissionTypeOptions,
    false
  );
  const admissionLabel = admissionFilter ? `; ${admissionFilter}` : "";
  return `${trailingLabel} (${periodLabel})${admissionLabel}`;
};

export const a = {};
