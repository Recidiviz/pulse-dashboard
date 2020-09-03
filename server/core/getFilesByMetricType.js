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

const FILES_BY_METRIC_TYPE = {
  freeThroughRecovery: [
    "ftr_referrals_by_month.json",
    "ftr_referrals_by_period.json",
    "ftr_referrals_by_age_by_period.json",
    "ftr_referrals_by_gender_by_period.json",
    "ftr_referrals_by_lsir_by_period.json",
    "ftr_referrals_by_participation_status.json",
    "ftr_referrals_by_race_and_ethnicity_by_period.json",
    "race_proportions.json",
    "site_offices.json",
  ],
  reincarceration: [
    "admissions_versus_releases_by_month.json",
    "admissions_versus_releases_by_period.json",
    "reincarceration_rate_by_stay_length.json",
    "reincarcerations_by_month.json",
    "reincarcerations_by_period.json",
  ],
  revocation: [
    "revocations_by_officer_by_period.json",
    "revocations_by_site_id_by_period.json",
    "admissions_by_type_by_period.json",
    "case_terminations_by_type_by_month.json",
    "case_terminations_by_type_by_officer_by_period.json",
    "race_proportions.json",
    "revocations_by_month.json",
    "revocations_by_period.json",
    "revocations_by_race_and_ethnicity_by_period.json",
    "revocations_by_supervision_type_by_month.json",
    "revocations_by_violation_type_by_month.json",
    "site_offices.json",
  ],
  snapshot: [
    "admissions_by_type_by_month.json",
    "admissions_by_type_by_period.json",
    "average_change_lsir_score_by_month.json",
    "average_change_lsir_score_by_period.json",
    "avg_days_at_liberty_by_month.json",
    "supervision_termination_by_type_by_month.json",
    "supervision_termination_by_type_by_period.json",
    "site_offices.json",
  ],
  newRevocations: [
    "revocations_matrix_by_month.json",
    "revocations_matrix_cells.json",
    "revocations_matrix_distribution_by_district.json",
    "revocations_matrix_distribution_by_gender.json",
    "revocations_matrix_distribution_by_race.json",
    "revocations_matrix_distribution_by_risk_level.json",
    "revocations_matrix_distribution_by_violation.json",
    "revocations_matrix_filtered_caseload.json",
    "revocations_matrix_supervision_distribution_by_district.json",
  ],
  communityGoals: [
    "admissions_by_type_by_month.json",
    "admissions_by_type_by_period.json",
    "average_change_lsir_score_by_month.json",
    "average_change_lsir_score_by_period.json",
    "revocations_by_month.json",
    "revocations_by_period.json",
    "supervision_termination_by_type_by_month.json",
    "supervision_termination_by_type_by_period.json",
    "site_offices.json",
  ],
  communityExplore: [
    "admissions_by_type_by_month.json",
    "admissions_by_type_by_period.json",
    "average_change_lsir_score_by_month.json",
    "average_change_lsir_score_by_period.json",
    "case_terminations_by_type_by_month.json",
    "case_terminations_by_type_by_officer_by_period.json",
    "race_proportions.json",
    "revocations_by_month.json",
    "revocations_by_officer_by_period.json",
    "revocations_by_period.json",
    "revocations_by_race_and_ethnicity_by_period.json",
    "revocations_by_supervision_type_by_month.json",
    "revocations_by_violation_type_by_month.json",
    "supervision_termination_by_type_by_month.json",
    "supervision_termination_by_type_by_period.json",
    "site_offices.json",
  ],
  facilitiesGoals: [
    "avg_days_at_liberty_by_month.json",
    "reincarcerations_by_month.json",
    "reincarcerations_by_period.json",
  ],
  facilitiesExplore: [
    "admissions_by_type_by_period.json",
    "admissions_versus_releases_by_month.json",
    "admissions_versus_releases_by_period.json",
    "avg_days_at_liberty_by_month.json",
    "reincarceration_rate_by_stay_length.json",
    "reincarcerations_by_month.json",
    "reincarcerations_by_period.json",
  ],
  programmingExplore: [
    "ftr_referrals_by_age_by_period.json",
    "ftr_referrals_by_gender_by_period.json",
    "ftr_referrals_by_lsir_by_period.json",
    "ftr_referrals_by_month.json",
    "ftr_referrals_by_participation_status.json",
    "ftr_referrals_by_period.json",
    "ftr_referrals_by_race_and_ethnicity_by_period.json",
    "race_proportions.json",
    "site_offices.json",
  ],
};

function getFilesByMetricType(metricType, file) {
  const files = FILES_BY_METRIC_TYPE[metricType];

  if (!files) {
    throw new Error(`No such metric type ${metricType}`);
  }

  if (file) {
    const normalizedFile = `${file}.json`;

    if (files.indexOf(normalizedFile) > -1) {
      return [normalizedFile];
    }

    throw new Error(
      `Metric file ${normalizedFile} not registered for metric type ${metricType}`
    );
  }

  return files;
}

module.exports = {
  FILES_BY_METRIC_TYPE,
  getFilesByMetricType,
};
