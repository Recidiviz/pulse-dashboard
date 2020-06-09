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

import "@testing-library/jest-dom/extend-expect";

import { calculateAverageRate, sortByCount, sortByRate, mergeRevocationData } from "../helpers";

describe("#calculateAverageRate", () => {
  const revocationData = [
    {"state_code": "US_MO", "violation_type": "FELONY", "reported_violations": "5", "population_count": "0", "total_supervision_count": "83", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
    {"state_code": "US_MO", "violation_type": "MISDEMEANOR", "reported_violations": "2", "population_count": "2", "total_supervision_count": "28", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
    {"state_code": "US_MO", "violation_type": "MISDEMEANOR", "reported_violations": "6", "population_count": "3", "total_supervision_count": "219", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
    {"state_code": "US_MO", "violation_type": "MISDEMEANOR", "reported_violations": "7", "population_count": "0", "total_supervision_count": "104", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
    {"state_code": "US_MO", "violation_type": "MUNICIPAL", "reported_violations": "6", "population_count": "0", "total_supervision_count": "5", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
    {"state_code": "US_MO", "violation_type": "SUBSTANCE_ABUSE", "reported_violations": "1", "population_count": "0", "total_supervision_count": "1350", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
    {"state_code": "US_MO", "violation_type": "SUBSTANCE_ABUSE", "reported_violations": "7", "population_count": "0", "total_supervision_count": "116", "supervision_type": "ALL", "charge_category": "ALL", "district": "ALL", "metric_period_months": "12"},
  ];

  const supervisionData = [
    {"charge_category": "ALL", "district": "ALL", "total_population": 3, "metric_period_months": "6", "reported_violations": "7", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "FELONY"},
    {"charge_category": "ALL", "district": "ALL", "total_population": 2, "metric_period_months": "6", "reported_violations": "5", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "ABSCONDED"},
    {"charge_category": "ALL", "district": "ALL", "total_population": 3, "metric_period_months": "12", "reported_violations": "8", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "ESCAPED"},
    {"charge_category": "ALL", "district": "ALL", "total_population": 2, "metric_period_months": "12", "reported_violations": "5", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "ESCAPED"},
    {"charge_category": "ALL", "district": "ALL", "total_population": 4, "metric_period_months": "12", "reported_violations": "3", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "SUBSTANCE_ABUSE"},
    {"charge_category": "ALL", "district": "ALL", "total_population": 4, "metric_period_months": "36", "reported_violations": "8", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "ESCAPED"},
    {"charge_category": "ALL", "district": "ALL", "total_population": 2, "metric_period_months": "36", "reported_violations": "8", "state_code": "US_MO", "supervision_type": "ALL", "violation_type": "MISDEMEANOR"},
  ];

  it("calculate avarage rate from filtered datasets", () => {
    expect(calculateAverageRate(revocationData, supervisionData)).toEqual(25);
  });
});

describe("sort functions", () => {
  const mergedRevocationData = [
    { district: "25", count: 397, total: 5200, rate: 7.634615384615385 },
    { district: "10", count: 453, total: 11352, rate: 3.990486257928118 },
    { district: "10N", count: 366, total: 6255, rate: 5.851318944844125 },
    { district: "14", count: 374, total: 4591, rate: 8.1463733391418 },
    { district: "11", count: 334, total: 6449, rate: 5.179097534501473 },
  ];

  it("sort merged revocation data by count", () => {
    expect(sortByCount(mergedRevocationData)).toEqual([
      { district: "10", count: 453, total: 11352, rate: 3.990486257928118 },
      { district: "25", count: 397, total: 5200, rate: 7.634615384615385 },
      { district: "14", count: 374, total: 4591, rate: 8.1463733391418 },
      { district: "10N", count: 366, total: 6255, rate: 5.851318944844125 },
      { district: "11", count: 334, total: 6449, rate: 5.179097534501473 },
    ]);
  });

  it("sort merged revocation data by rate", () => {
    expect(sortByRate(mergedRevocationData)).toEqual([
      { district: "14", count: 374, total: 4591, rate: 8.1463733391418 },
      { district: "25", count: 397, total: 5200, rate: 7.634615384615385 },
      { district: "10N", count: 366, total: 6255, rate: 5.851318944844125 },
      { district: "11", count: 334, total: 6449, rate: 5.179097534501473 },
      { district: "10", count: 453, total: 11352, rate: 3.990486257928118 },
    ]);
  });
});

describe("mergeRevocationData", () => {
  const revocationMap = { "25": 397, "10": 453, "10N": 366, "14": 374, "11": 334 };
  const supervisionMap = { "25": 5200, "10": 11352, "10N": 6255, "14": 4591, "11": 6449 };

  it("should merge revocation and supervision data into one map", () => {
    expect(mergeRevocationData(revocationMap, supervisionMap)).toEqual([
      { district: "10", count: 453, total: 11352, rate: 3.990486257928118 },
      { district: "11", count: 334, total: 6449, rate: 5.179097534501473 },
      { district: "14", count: 374, total: 4591, rate: 8.1463733391418 },
      { district: "25", count: 397, total: 5200, rate: 7.634615384615385 },
      { district: "10N", count: 366, total: 6255, rate: 5.851318944844125 },
    ]);
  });
});
