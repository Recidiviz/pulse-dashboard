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

export default {
  District: "Sub-office",
  officer: "agent",
  Officer: "Agent",
  gender: "sex",
  Gender: "Sex",
  violationReports: "violation reports",
  revocationsOverTimeChartTitle: "Number of recommitments from parole",
  revocationsMatrixChartTitle:
    "Recommitments by violation history (in year prior to their last reported violation)",
  revocationsByDistrictChartTitle: "Recommitments by district and sub-office",
  revocationsByOfficerChartTitle: "Recommitments by agent",
  revocationsByRiskLevelChartTitle: "Recommitments by risk level",
  revocationsByGenderChartTitle: "Recommitments by sex",
  revocationsByRaceChartTitle: "Recommitments by race/ethnicity",
  caseTableTitle: "Recommitted individuals",
  revocationsOverTimeChartId: "recommitmentsOverTime",
  revocationsMatrixChartId: "recommitmentsMatrix",
  revocationsByDistrictChartId: "recommitmentsBySubOffice",
  revocationsByOfficerChartId: "recommitmentsByAgent",
  revocationsByRiskLevelChartId: "recommitmentsByRiskLevel",
  revocationsByViolationChartId: "recommitmentsByViolationType",
  revocationsByGenderChartId: "recommitmentsBySex",
  revocationsByRaceChartId: "recommitmentsByRace",
  revoked: "recommitted",
  Revocation: "Recommitment",
  Revocations: "Recommitments",
  revocation: "recommitment",
  revocations: "recommitments",
  Admission: "Recommitment",
  admission: "recommitment",
  percentOfPopulationRevoked: "Recommitment rate of standing population",
  matrixExplanationP1: `This chart plots all people who were recommitted on a board 
  action to SCIs, CCCs, or Contract Facilities from parole during the selected 
  time period, according to their most serious violation and the total number 
  of violation reports that were filed within one year prior to the 
  last reported violation before the person was recommitted. 
  (See "Additional Info" for more details.)`,
  matrixExplanationP2: `The numbers inside the bubbles represent the number of
people who were recommitted, whose most serious violation matches the violation at
the head of that row, and who have the number of prior violations at the head
of that column.`,
  Technical: "Low tech.",
  riskLevelsMap: {
    OVERALL: "Overall",
    NOT_ASSESSED: "No Score",
    LOW: "Low Risk",
    MEDIUM: "Medium Risk",
    HIGH: "High Risk",
  },
  populationChartAttributes: {
    REVOKED: "Recommitted Population",
    SUPERVISION_POPULATION: "Supervision Population",
    STATE_POPULATION: "Pennsylvania Population",
  },
  raceLabelMap: {
    WHITE: "White",
    BLACK: "Black",
    HISPANIC: "Hispanic",
    OTHER: "Other",
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
