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
const FILES_BY_METRIC_TYPE = {
  newRevocation: [
    "revocations_matrix_by_month.txt",
    "revocations_matrix_cells.txt",
    "revocations_matrix_distribution_by_district.txt",
    "revocations_matrix_distribution_by_gender.txt",
    "revocations_matrix_distribution_by_officer.txt",
    "revocations_matrix_distribution_by_race.txt",
    "revocations_matrix_distribution_by_risk_level.txt",
    "revocations_matrix_distribution_by_violation.txt",
    "revocations_matrix_filtered_caseload.txt",
    "supervision_location_ids_to_names.json",
    "supervision_location_restricted_access_emails.json",
  ],
  communityGoals: [
    "admissions_by_type_by_month.txt",
    "admissions_by_type_by_period.txt",
    "average_change_lsir_score_by_month.txt",
    "average_change_lsir_score_by_period.txt",
    "revocations_by_month.txt",
    "revocations_by_period.txt",
    "supervision_termination_by_type_by_month.txt",
    "supervision_termination_by_type_by_period.txt",
    "site_offices.json",
  ],
  communityExplore: [
    "admissions_by_type_by_month.txt",
    "admissions_by_type_by_period.txt",
    "average_change_lsir_score_by_month.txt",
    "average_change_lsir_score_by_period.txt",
    "case_terminations_by_type_by_month.txt",
    "case_terminations_by_type_by_officer_by_period.txt",
    "race_proportions.json",
    "revocations_by_month.txt",
    "revocations_by_officer_by_period.txt",
    "revocations_by_period.txt",
    "revocations_by_race_and_ethnicity_by_period.txt",
    "revocations_by_supervision_type_by_month.txt",
    "revocations_by_violation_type_by_month.txt",
    "supervision_termination_by_type_by_month.txt",
    "supervision_termination_by_type_by_period.txt",
    "site_offices.json",
  ],
  facilitiesGoals: [
    "avg_days_at_liberty_by_month.txt",
    "reincarcerations_by_month.txt",
    "reincarcerations_by_period.txt",
  ],
  facilitiesExplore: [
    "admissions_by_type_by_period.txt",
    "admissions_versus_releases_by_month.txt",
    "admissions_versus_releases_by_period.txt",
    "avg_days_at_liberty_by_month.txt",
    "reincarceration_rate_by_stay_length.txt",
    "reincarcerations_by_month.txt",
    "reincarcerations_by_period.txt",
  ],
  programmingExplore: [
    "ftr_referrals_by_age_by_period.txt",
    "ftr_referrals_by_gender_by_period.txt",
    "ftr_referrals_by_lsir_by_period.txt",
    "ftr_referrals_by_month.txt",
    "ftr_referrals_by_participation_status.txt",
    "ftr_referrals_by_period.txt",
    "ftr_referrals_by_race_and_ethnicity_by_period.txt",
    "race_proportions.json",
    "site_offices.json",
  ],
};

module.exports = {
  FILES_BY_METRIC_TYPE,
};
