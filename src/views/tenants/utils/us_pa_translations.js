// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

// Note: Each time you add a translation you will need to restart your dev
// server before you will see the translation rendered properly

import { US_PA_METHODOLOGY } from "./us_pa_methodology";

export default {
  officer: "agent",
  Officer: "Agent",
  gender: "sex",
  Gender: "Sex",
  violationReports: "violation reports",
  revocationsOverTimeXAxis: "Number of SCI admissions from parole",
  revoked: "admitted",
  Revocation: "Admission",
  Revocations: "Admissions",
  revocation: "admission",
  revocations: "admissions",
  percentOfPopulationRevoked: "Admission rate of standing population",
  matrixExplanationP1: `This chart plots all people who were admitted to SCIs
from parole during the selected time period, according to their most serious
violation and the total number of violation reports that were filed within
one year prior to the last reported violation before the person was admitted.
(See “Additional Info” for more details.)`,
  matrixExplanationP2: `The numbers inside the bubbles represent the number of
people who were admitted, whose most serious violation matches the violation at
the head of that row, and who have the number of prior violations at the head
of that column.`,
  Technical: "Low tech.",
  lastRecommendation: "Last recommendation",
  methodology: US_PA_METHODOLOGY,
  riskLevelsMap: {
    OVERALL: "Overall",
    NOT_ASSESSED: "Not Assessed",
    LOW: "Low Risk",
    MEDIUM: "Medium Risk",
    HIGH: "High Risk",
  },
  raceLabelMap: {
    WHITE: "White",
    BLACK: "Black",
    HISPANIC: "Hispanic",
    ASIAN: "Asian",
    AMERICAN_INDIAN_ALASKAN_NATIVE: "Native American",
  },
  violationTypes: [
    "LOW_TECH",
    "MED_TECH",
    "ELEC_MONITORING",
    "SUBSTANCE_ABUSE",
    "ABSCONDED",
    "HIGH_TECH",
    "LAW",
  ],
  violationsBySeverity: [
    "law",
    "high_tech",
    "absc",
    "subs",
    "em",
    "med_tech",
    "low_tech",
  ],
};
