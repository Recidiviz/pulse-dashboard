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

const { default: BaseMetrics } = require("../BaseMetrics");
const { default: RESOURCES } = require("../resources");
const { COLLECTIONS } = require("../../constants/collections");

describe("BaseMetrics", () => {
  const stateCode = "US_MO";
  const filename = "revocations_matrix_by_month";
  let metric;
  beforeEach(() => {
    metric = new BaseMetrics(COLLECTIONS.NEW_REVOCATION, stateCode);
  });

  it("sets the metricType property", () => {
    expect(metric.metricType).toEqual(COLLECTIONS.NEW_REVOCATION);
  });

  it("sets the stateCode property", () => {
    expect(metric.stateCode).toEqual(stateCode);
  });

  it("sets the metrics property", () => {
    expect(metric.metrics).toEqual(
      RESOURCES[stateCode][COLLECTIONS.NEW_REVOCATION]
    );
    expect(metric.metrics).toHaveProperty(filename);
  });

  it("throws an error for incorrect metric types", () => {
    expect(() => new BaseMetrics("fakeType", stateCode)).toThrowError(
      new Error(`Cannot instantiate BaseMetrics with metricType: fakeType`)
    );
  });

  describe(".getFileNamesList", () => {
    it("given a file name it returns an array with the filename and its extension", () => {
      expect(metric.getFileNamesList(filename)).toEqual([`${filename}.txt`]);
    });

    it("given no file names it returns an array with all files and extensions", () => {
      expect(metric.getFileNamesList()).toEqual([
        "supervision_location_ids_to_names.json",
        "state_race_ethnicity_population.json",
        "state_gender_population.json",
        "supervision_location_restricted_access_emails.json",
        "revocations_matrix_by_month.txt",
        "revocations_matrix_cells.txt",
        "revocations_matrix_distribution_by_district.txt",
        "revocations_matrix_distribution_by_gender.txt",
        "revocations_matrix_distribution_by_officer.txt",
        "revocations_matrix_distribution_by_race.txt",
        "revocations_matrix_distribution_by_risk_level.txt",
        "revocations_matrix_distribution_by_violation.txt",
        "revocations_matrix_filtered_caseload.txt",
      ]);
    });
  });
});
