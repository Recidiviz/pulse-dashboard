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

const chartIdToInfo = {
  revocationMatrix: [
    'This chart shows the number of people revoked to prison from probation and parole, broken down by their most severe violation and the number of violation reports filed before revocation.',
    'Revocations count all people who were incarcerated in a DOC-operated facility because their supervision was revoked.',
    'Revocations are included based on the date that the person was admitted to a DOC facility because their supervision was revoked, not the date of the causal violation or offense.',
    'Each individual number in the chart has been deduplicated by person. However, a person can be counted in multiple numbers in the chart if they had multiple distinct terms of supervision that ended in revocation in the measurement window.',
    'The y-axis shows the "most severe" violation recorded during the person\'s term of supervision, where severity is ordered as follows: Felony, Misdemeanor, Absconsion, Municipal, Substance Abuse, Technical Violation.',
    'The x-axis shows the number of violation reports and/or notices of citation that were officially filed prior to the revocation, including the final one which led to the revocation taking place.',
    'Clicking on a violation type label along the y-axis will filter all other charts and tables in the view to only display information which also included that violation type as its most severe.',
    'Clicking on a specific cell in the chart will filter all other charts by both the most severe violation and also the number of violation reports or notices of citation filed.',
  ],
  revocationsOverTime: [
    'This chart shows the number of people revoked to prison from probation and parole by month.',
    'Revocations count all people who were incarcerated in a DOC-operated facility because their supervision was revoked.',
    'Revocations are included based on the date that the person was admitted to a DOC facility because their supervision was revoked, not the date of the causal violation or offense.',
    'Each month in the chart has been deduplicated by person. However, a person can be counted in multiple months in the chart if they had multiple distinct terms of supervision that ended in revocation in the measurement window.',
  ],
  revocationsByDistrict: [
    'This chart shows the number of people revoked to prison from probation and parole, broken down by the district that they were being supervised in at the time of revocation.',
    'The chart can be toggled to show either revocation counts or revocation rates. The revocation rate is defined as the number of revocations that occurred within that district divided by the number of people supervised within that district at some point in the course of the measurement window.',
    'Revocations count all people who were incarcerated in a DOC-operated facility because their supervision was revoked.',
    'Revocations are included based on the date that the person was admitted to a DOC facility because their supervision was revoked, not the date of the causal violation or offense.',
    'Each district in the chart has been deduplicated by person. However, a person can be counted in multiple districts in the chart if they had multiple distinct terms of supervision that ended in revocation in the measurement window.',
  ],
  revocationsByGender: [
    'This chart shows the number of people revoked to prison from probation and parole, broken down by both gender and risk level, as determined by recorded assessments from the Ohio Risk Assessment System (ORAS).',
    'If an individual has more than one gender recorded from different ingested data tables, then they are counted towards the gender from the particular ingested data table which is considered to be closest to a "source of truth."',
    'Revocations count all people who were incarcerated in a DOC-operated facility because their supervision was revoked.',
    'Revocations are included based on the date that the person was admitted to a DOC facility because their supervision was revoked, not the date of the causal violation or offense.',
    'Each risk level and gender combination in the chart has been deduplicated by person. However, a person can be counted in multiple such combinations if they had multiple distinct terms of supervision that ended in revocation in the measurement window.',
  ],
  revocationsByRace: [
    'This chart shows the number of people revoked to prison from probation and parole, broken down by both race and risk level, as determined by recorded assessments from the Ohio Risk Assessment System (ORAS).',
    'If an individual has more than one race or ethnicity recorded from different ingested data tables, then they are counted once for each unique race and ethnicity. This means that the total count in this chart may be larger than the total number of individuals it describes.',
    'Revocations count all people who were incarcerated in a DOC-operated facility because their supervision was revoked.',
    'Revocations are included based on the date that the person was admitted to a DOC facility because their supervision was revoked, not the date of the causal violation or offense.',
    'Each risk level and race combination in the chart has been deduplicated by person. However, a person can be counted in multiple such combinations if they had multiple distinct terms of supervision that ended in revocation in the measurement window.',
  ],
  revocationsByRiskLevel: [
    'This chart shows the number of people revoked to prison from probation and parole, broken down by risk level, as determined by recorded assessments from the Ohio Risk Assessment System (ORAS).',
    'Revocations count all people who were incarcerated in a DOC-operated facility because their supervision was revoked.',
    'Revocations are included based on the date that the person was admitted to a DOC facility because their supervision was revoked, not the date of the causal violation or offense.',
    'Each risk level in the chart has been deduplicated by person. However, a person can be counted in multiple risk levels if they had multiple distinct terms of supervision that ended in revocation in the measurement window.',
  ],
  revocationsByViolationType: [
    'This chart shows the relative frequency of each type of violation for individuals who were revoked to prison, over the measurement window.',
    'This is calculated by looking at all notices of citation and violation reports filed for these individuals during that time period, counting the number of times each type of violation was reported, and dividing this by the total number of reported violations.',
    'If multiple conditions violated are listed on one report or one notice of citation, they are all counted.',
  ],
  filteredCaseTable: [
    'This table shows all cases which correspond to the data points in the revocation matrix above. That is, each case listed below corresponds to a particular period of supervision that ended in a revocation.',
    'This table is filtered by the filters at the top of the page. Only cases matching all selected filters will be displayed in this table.',
    'This table is also filtered by the row or cell selections in the matrix view above. Only cases matching the selected row or cell will be displayed in this table.',
    'The cases are sorted first by district, and second by officer.',
    'The violations listed in the Violation Record column are ordered by severity.',
    'The Officer Recommendation displays the most severe recommendation that was made over the course of the period of supervision.',
  ],
};

export {
  chartIdToInfo,
};
