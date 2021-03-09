/* eslint-disable prettier/prettier */
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

import { sumCounts } from "../sumCounts";
import { calculateRate } from "../rate";

describe("#calculateAverageRate", () => {
  const revocationData = [
    {
      state_code: "US_MO",
      violation_type: "FELONY",
      reported_violations: "5",
      revocation_count: "0",
      supervision_population_count: "83",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
    {
      state_code: "US_MO",
      violation_type: "MISDEMEANOR",
      reported_violations: "2",
      revocation_count: "2",
      supervision_population_count: "28",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
    {
      state_code: "US_MO",
      violation_type: "MISDEMEANOR",
      reported_violations: "6",
      revocation_count: "3",
      supervision_population_count: "219",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
    {
      state_code: "US_MO",
      violation_type: "MISDEMEANOR",
      reported_violations: "7",
      revocation_count: "0",
      supervision_population_count: "104",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
    {
      state_code: "US_MO",
      violation_type: "MUNICIPAL",
      reported_violations: "6",
      revocation_count: "0",
      supervision_population_count: "5",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
    {
      state_code: "US_MO",
      violation_type: "SUBSTANCE_ABUSE",
      reported_violations: "1",
      revocation_count: "0",
      supervision_population_count: "1350",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
    {
      state_code: "US_MO",
      violation_type: "SUBSTANCE_ABUSE",
      reported_violations: "7",
      revocation_count: "0",
      supervision_population_count: "116",
      supervision_type: "ALL",
      charge_category: "ALL",
      district: "ALL",
      metric_period_months: "12",
    },
  ];

  const supervisionData = [
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 3,
      metric_period_months: "6",
      reported_violations: "7",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "FELONY",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 2,
      metric_period_months: "6",
      reported_violations: "5",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "ABSCONDED",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 3,
      metric_period_months: "12",
      reported_violations: "8",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "ESCAPED",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 2,
      metric_period_months: "12",
      reported_violations: "5",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "ESCAPED",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 4,
      metric_period_months: "12",
      reported_violations: "3",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "SUBSTANCE_ABUSE",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 4,
      metric_period_months: "36",
      reported_violations: "8",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "ESCAPED",
    },
    {
      charge_category: "ALL",
      district: "ALL",
      total_population: 2,
      metric_period_months: "36",
      reported_violations: "8",
      state_code: "US_MO",
      supervision_type: "ALL",
      violation_type: "MISDEMEANOR",
    },
  ];

  it("calculate avarage rate from filtered datasets", () => {
    expect(
      calculateRate(
        sumCounts("revocation_count", revocationData),
        sumCounts("total_population", supervisionData)
      )
    ).toEqual(25);
  });
});
