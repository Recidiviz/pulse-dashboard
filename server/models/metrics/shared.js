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

const DEFAULT_MONTH = [
  "1",
  "10",
  "11",
  "12",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

// TODO #763 - Remove "0" reported violations from the validation
const DEFAULT_REPORTED_VIOLATIONS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];

const DEFAULT_METRIC_PERIOD_MONTHS = ["12", "36", "6", "1", "3"];

const COMMUNITY_GOALS = {
  admissions_by_type_by_month: {
    filename: "admissions_by_type_by_month.txt",
  },
  admissions_by_type_by_period: {
    filename: "admissions_by_type_by_period.txt",
  },
  average_change_lsir_score_by_month: {
    filename: "average_change_lsir_score_by_month.txt",
  },
  average_change_lsir_score_by_period: {
    filename: "average_change_lsir_score_by_period.txt",
  },
  revocations_by_month: {
    filename: "revocations_by_month.txt",
  },
  revocations_by_period: {
    filename: "revocations_by_period.txt",
  },
  supervision_termination_by_type_by_month: {
    filename: "supervision_termination_by_type_by_month.txt",
  },
  supervision_termination_by_type_by_period: {
    filename: "supervision_termination_by_type_by_period.txt",
  },
  site_offices: {
    filename: "site_offices.json",
  },
};

const COMMUNITY_EXPLORE = {
  admissions_by_type_by_month: { filename: "admissions_by_type_by_month.txt" },
  admissions_by_type_by_period: {
    filename: "admissions_by_type_by_period.txt",
  },
  average_change_lsir_score_by_month: {
    filename: "average_change_lsir_score_by_month.txt",
  },
  average_change_lsir_score_by_period: {
    filename: "average_change_lsir_score_by_period.txt",
  },
  case_terminations_by_type_by_month: {
    filename: "case_terminations_by_type_by_month.txt",
  },
  case_terminations_by_type_by_officer_by_period: {
    filename: "case_terminations_by_type_by_officer_by_period.txt",
  },
  race_proportions: { filename: "race_proportions.json" },
  revocations_by_month: { filename: "revocations_by_month.txt" },
  revocations_by_officer_by_period: {
    filename: "revocations_by_officer_by_period.txt",
  },
  revocations_by_period: { filename: "revocations_by_period.txt" },
  revocations_by_race_and_ethnicity_by_period: {
    filename: "revocations_by_race_and_ethnicity_by_period.txt",
  },
  revocations_by_supervision_type_by_month: {
    filename: "revocations_by_supervision_type_by_month.txt",
  },
  revocations_by_violation_type_by_month: {
    filename: "revocations_by_violation_type_by_month.txt",
  },
  supervision_termination_by_type_by_month: {
    filename: "supervision_termination_by_type_by_month.txt",
  },
  supervision_termination_by_type_by_period: {
    filename: "supervision_termination_by_type_by_period.txt",
  },
  site_offices: { filename: "site_offices.json" },
};

const FACILITIES_GOALS = {
  avg_days_at_liberty_by_month: {
    filename: "avg_days_at_liberty_by_month.txt",
  },
  reincarcerations_by_month: { filename: "reincarcerations_by_month.txt" },
  reincarcerations_by_period: { filename: "reincarcerations_by_period.txt" },
};

const FACILITIES_EXPLORE = {
  admissions_by_type_by_period: {
    filename: "admissions_by_type_by_period.txt",
  },
  admissions_versus_releases_by_month: {
    filename: "admissions_versus_releases_by_month.txt",
  },
  admissions_versus_releases_by_period: {
    filename: "admissions_versus_releases_by_period.txt",
  },
  avg_days_at_liberty_by_month: {
    filename: "avg_days_at_liberty_by_month.txt",
  },
  reincarceration_rate_by_stay_length: {
    filename: "reincarceration_rate_by_stay_length.txt",
  },
  reincarcerations_by_month: { filename: "reincarcerations_by_month.txt" },
  reincarcerations_by_period: { filename: "reincarcerations_by_period.txt" },
};

const PROGRAMMING_EXPLORE = {
  ftr_referrals_by_age_by_period: {
    filename: "ftr_referrals_by_age_by_period.txt",
  },
  ftr_referrals_by_gender_by_period: {
    filename: "ftr_referrals_by_gender_by_period.txt",
  },
  ftr_referrals_by_lsir_by_period: {
    filename: "ftr_referrals_by_lsir_by_period.txt",
  },
  ftr_referrals_by_month: { filename: "ftr_referrals_by_month.txt" },
  ftr_referrals_by_participation_status: {
    filename: "ftr_referrals_by_participation_status.txt",
  },
  ftr_referrals_by_period: { filename: "ftr_referrals_by_period.txt" },
  ftr_referrals_by_race_and_ethnicity_by_period: {
    filename: "ftr_referrals_by_race_and_ethnicity_by_period.txt",
  },
  race_proportions: { filename: "race_proportions.json" },
  site_offices: { filename: "site_offices.json" },
};

module.exports = {
  DEFAULT_MONTH,
  DEFAULT_REPORTED_VIOLATIONS,
  DEFAULT_METRIC_PERIOD_MONTHS,
  COMMUNITY_GOALS,
  COMMUNITY_EXPLORE,
  FACILITIES_GOALS,
  FACILITIES_EXPLORE,
  PROGRAMMING_EXPLORE,
};
