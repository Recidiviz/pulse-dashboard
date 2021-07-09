// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
  excludeOption,
  flatOptions,
  formatSelectOptionValue,
} from "../../controls/utils";
import {
  getPeriodLabelFromMetricPeriodMonthsFilter,
  getTrailingLabelFromMetricPeriodMonthsFilter,
} from "../../utils/formatStrings";

export const getTimeDescription = (
  months,
  admissionTypeEnabled,
  admissionOptions,
  admissionType
) => {
  const trailingLabel = getTrailingLabelFromMetricPeriodMonthsFilter(months);
  const periodLabel = getPeriodLabelFromMetricPeriodMonthsFilter(months);

  if (!admissionTypeEnabled) {
    return `${trailingLabel} (${periodLabel})`;
  }

  const admissionTypeOptions = excludeOption(
    flatOptions(admissionOptions),
    admissionOptions[0]
  ).filter((ao) => admissionType.includes(ao.value));

  const admissionFilter = formatSelectOptionValue({
    allOptions: admissionOptions,
    summingOption: admissionOptions[0],
    selectedOptions: admissionTypeOptions,
    isCore: false,
    isShortFormat: false,
  });

  const admissionLabel = admissionFilter ? `; ${admissionFilter}` : "";
  return `${trailingLabel} (${periodLabel})${admissionLabel}`;
};

export const a = {};
