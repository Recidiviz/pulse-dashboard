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

const { getFileName } = require("../utils/fileName");
const FILES_BY_METRIC_TYPE = {
  newRevocation: [
    "revocations_matrix_by_month.txt",
    "revocations_matrix_cells.txt",
    "revocations_matrix_distribution_by_district.txt",
    "revocations_matrix_distribution_by_gender.txt",
    "revocations_matrix_distribution_by_race.txt",
    "revocations_matrix_distribution_by_risk_level.txt",
    "revocations_matrix_distribution_by_violation.txt",
    "revocations_matrix_filtered_caseload.json",
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

/**
 * Retrieves the names of all of the files which are available for the given metric type,
 * with the filenames that are hard-coded for each file.
 *
 * If a specific file is requested, this checks that the file is available for the
 * given metric type, and sets the proper extension on the filename.
 */
function getFilesByMetricType(metricType, file) {
  const files = FILES_BY_METRIC_TYPE[metricType];

  if (!files) {
    throw new Error(`No such metric type ${metricType}`);
  }

  if (file) {
    const fileWithExtension = files.find((item) => getFileName(item) === file);

    if (!fileWithExtension) {
      throw `${file} not found with either txt or json extension for metric type ${metricType}`;
    }

    if (files.indexOf(fileWithExtension) > -1) {
      return [fileWithExtension];
    }

    throw new Error(
      `Metric file ${fileWithExtension} not registered for metric type ${metricType}`
    );
  }

  return files;
}

module.exports = {
  FILES_BY_METRIC_TYPE,
  getFilesByMetricType,
};
