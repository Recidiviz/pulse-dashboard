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

export const US_PA_METHODOLOGY = {
  admissionsOverTime: [
    {
      header: "What this chart shows",
      body: `This chart displays the total number of people who were admitted to SCIs during each month.`,
    },
    {
      header: "Who is included",
      body: `Counts include all people who were admitted to SCIs from parole. This includes people on parole who were admitted for non-revocation sanctions and those who were admitted for revocation. Counts do not include (1) people with Parole Violator Pending status; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from District 2.`,
    },
  ],
  admissionMatrix: [
    {
      header: "What this chart shows",
      body: `This chart plots all people who were admitted to SCIs from supervision during the time period selected by the user, according to their most serious violation and the total number of violation reports. The user can select the time period for admissions included in the chart by using the drop-down menu in the upper left corner of the page. The most serious violation and total number of reported violations are determined by looking back at all violation reports filed within one year prior to the last reported violation before their admission. For example, if the last violation a person committed occurred on February 1, 2017, and they were admitted on January 15, 2018, the most serious violation and number of violations would be determined by looking over the period of February 1, 2016–February 1, 2017. This methodology negates the lag time between the last violation report and the board action, and therefore gives a fuller picture of a person’s behavioral record leading up to the admission decision. Reports filed after the admission are not included, since they were presumptively irrelevant to the admission.`,
    },
    {
      header: "Most serious violation",
      body: `Violations, starting with the least serious, are listed in order of severity: low technical, medium technical, electronic monitoring, substance use, absconding, high technical, law violation. The most serious violation determines what row a person is placed in, regardless of whether it was the most recent violation. For example, if a person had one law violation, then two low technical violations, then one substance use violation, and then they were admitted, they would be placed in the law violation row because a law violation is their most serious violation.`,
    },
    {
      header: "Number of violation reports filed",
      body: `This is determined by counting the total number of reports that were filed one year prior to the last reported violation before their admission. For example, if a person had one violation report on February 10, 2016, and one violation report  on February 1, 2017, and then they were admitted (without any new violations), they would be in the "2" column. This is the case even if several types of violations or conditions violated were listed within a single report.`,
    },
    {
      header: "Who is included",
      body: `Counts include all people who were admitted to SCIs from parole. This includes people on parole who were admitted for non-revocation sanctions and those who were admitted for revocation. Counts do not include (1) people with Parole Violator Pending status who have been detained pending a revocation hearing but have not been legally revoked; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from District 2.`,
    },
  ],
  admissionsByDistrict: [
    {
      header: `What the "Admission count" chart shows`,
      body: `This chart shows the total number of people admitted to SCIs from parole from each district during the time period selected in the "Time Period" drop-down menu. The districts are positioned in descending order from left to right, with the district with the highest number of people admitted at the left. If a person’s district is unknown (meaning they were not under active supervision in any district within two years prior to their admission), they are not included in the district counts or rates.`,
    },
    {
      header: `What the "Admission rate of standing population" chart shows`,
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the admission rate from parole in each district. Admission rate is defined as the number of people admitted from that district in the selected time period divided by the total supervised population within that district during the same time period. The districts are positioned in descending order from left to right, with the district with the highest admission rate at the left. If a person’s district is unknown (meaning they were not under active supervision within two years prior to their admission), they are not included in the district counts or rates. When hovering over any district column, users can see the total number of people on supervision in that district as the denominator and the total number of people admitted in that district as the numerator.`,
    },
    {
      header: "Who is included",
      body: `Counts include all people who were admitted to SCIs from parole. This includes people on parole who were admitted for non-revocation sanctions and those who were admitted for revocation. Counts do not include (1) people with Parole Violator Pending status who have been detained pending a revocation hearing but have not been legally revoked; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from District 2.`,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, this chart will show the percentage of people admitted with the selected violation history among those with a similar violation history within each district. For example, if the user selected the low technical row on the plot, the chart would show for each district, the number of people admitted whose most serious violation was a low technical, divided by the total number of people on supervision whose most serious violation was a low technical, regardless of whether they were admitted. Continuing with this example, if a user hovers over the district column, the numerator would be all people admitted for a low technical violation in that district, and the denominator would be all people who committed a low technical violation, whether they were admitted to a DOC facility or not. Comparing these percentages will indicate whether admission practices differ by district for various violation histories. That is, whether people with similar violation histories are admitted more frequently in one district than another. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on supervision) or the date that the person was discharged from supervision.`,
    },
  ],
  admissionsByRiskLevel: [
    {
      header: "What this chart shows",
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the percentage of people who were admitted in each risk level group. This is calculated as the number of people in each risk level who were admitted divided by the total number of people on supervision at that risk level. Risk level is defined based only on the LSI-R tool and no other assessment. Those without LSI-R scores are counted in the Unassessed category. LSI-R scores above 54 are not counted. When hovering over any risk column, users can see the total number of people on supervision assessed at that specific risk level as the denominator and the total number of people admitted at that risk level as the numerator.`,
    },
    {
      header: "Who is included",
      body: `Counts include all people who were admitted to SCIs from parole. This includes people on parole who were admitted for non-revocation sanctions and those who were admitted for revocation. Counts do not include (1) people with Parole Violator Pending status who have been detained pending a revocation hearing but have not been legally revoked; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from District 2.`,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, this chart will show the percentage of people admitted with the selected violation history among those on supervision with the same risk level. For example, if the user selected the low technical row on the plot, the chart would show for each risk level, the number of people admitted whose most serious violation was a low technical, divided by the total number of people on supervision whose most serious violation was a low technical, regardless of whether they were admitted. Continuing with this example, if a user hovers over the low-risk column, the numerator would be all low-risk people admitted for a low technical violation, and the denominator would be all low-risk people who committed a low technical violation, whether they were admitted to a DOC facility or not. Comparing these percentages will indicate whether admission practices are sensitive to risk level. That is, whether people who are higher risk are admitted more frequently than lower-risk people who have similar violation histories. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on supervision) or the date that the person was discharged from supervision.`,
    },
  ],
  admissionsByViolationType: [
    {
      header: "What this chart shows",
      body: `This chart shows the relative frequency of each type of violation among the selected group. The blue bars represent the different categories of conditions violated that constitute technical violations. The orange bars represent law violations. This is calculated as follows: the total number of violation reports upon which each type of violation appears, divided by the total number of violation reports filed. Violation counts include all reported violations filed within one year of a person's last violation before they were admitted. For this chart only, if multiple violation types are listed on one violation report, they are all counted. For example, if a single violation report lists both an absconsion violation and an electronic monitoring violation, both are counted. Hence the total number of reported violations included in this chart will be larger than the total number of violation reports. For example, if there were a total of 100 violation reports, but each report listed 2 different violations, the denominator in each percentage would still be 100. If, out of these 100 violation reports, 20 included at least one employment violation, then the percentage for employment violations would be 20/100=20 percent.`,
    },
    {
      header: "Who is included",
      body: `Counts include only violation records for people who were admitted to SCIs from parole. This includes people on parole who were admitted for non-revocation sanctions and those who were admitted for revocation. Counts do not include (1) people with Parole Violator Pending status who have been detained pending a revocation hearing but have not been legally revoked; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from District 2.`,
    },
  ],
  admissionsBySex: [
    {
      header: "What this chart shows",
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the percent of each sex who were admitted, on supervision, and in Pennsylvania’s general population. At a high level, comparing these percentages can indicate whether a given sex is over- or under-represented when compared to the broader population. If an individual does not have a known sex, they are excluded from this chart.`,
    },
    {
      body: `"Pennsylvania Population" refers to the number of individuals of the selected sex divided by the total number of people in Pennsylvania, according to the US Census Bureau. This value stays the same regardless of whether any filters are selected on the page.`,
    },
    {
      body: `The "Supervision Population" refers to the number of individuals of the selected sex divided by the total number of people on parole supervision during the selected time period. `,
    },
    {
      body: `"Admitted Population" refers to the number of individuals of the selected sex who were admitted to SCIs from parole divided by the total number of people admitted to SCIs from parole during the selected time period. Counts do not include (1) people with Parole Violator Pending status; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. `,
    },
    {
      body: `If a specific district is selected, "Admitted population" and the "Parole Population" will only include individuals currently assigned to or terminated by an agent from that district. `,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, the groups of "Admitted Population" and "Supervision Population" groups will be updated. If a user selected the row "Low tech.", the denominator of "Admitted Population" will now only be people who were admitted with a most serious violation of low technical, and the numerator would be the subset of people who are of the selected sex and who have been admitted with a most serious violation of a low technical. Similarly, with the above example, the "Supervision Population" denominator would now be all people on parole who committed a low technical violation, whether or not they were admitted, and the numerator would be the subset of that population who were of the specified sex. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on parole) or the date that the person was discharged from parole.`,
    },
  ],
  admissionsByRace: [
    {
      header: "What this chart shows",
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart compares the percentage of people in each race/ethnicity group who were admitted, overall and broken out by risk level. Admission rates specific to race/ethnicity and risk level are calculated as follows: overall and for each risk level, the number of people of a given race/ethnicity admitted divided by the total number of people of a given race/ethnicity in that risk level group. Risk level is defined based only on the LSI-R tool and no other assessment. Those without LSI-R scores are counted in the Unassessed category. LSI-R scores above 54 are not counted. When hovering over any column, users can see the total number of people on supervision of a given race/ethnicity who were assessed at that specific risk level as the denominator and the total number of people admitted at that risk level and race/ethnicity as the numerator.`,
    },
    {
      header: "Who is included",
      body: `Counts include all people who were admitted to SCIs from parole. This includes people on parole who were admitted for non-revocation sanctions and those who were admitted for revocation. Counts do not include (1) people with Parole Violator Pending status who have been detained pending a revocation hearing but have not been legally revoked; (2) people who are serving a State Indeterminate Punishment sentence; (3) placements in Parole Violator Centers. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from District 2.`,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, this chart will show the percentage of people admitted with the selected violation history, for each race/ethnicity and risk level group among those on supervision with the same race/ethnicity and risk level. For example, if the user selected the low technical row on the plot, the chart would show overall and for each risk level, the number of people of each race/ethnicity who were admitted whose most serious violation was a low technical, divided by the total number of people on supervision of that race/ethnicity whose most serious violation was a low technical, regardless of whether they were admitted. Continuing with this example, if a user hovers over the low-risk column for Black, the numerator would be all low-risk Black people admitted for a low technical violation, and the denominator would be all low-risk Black people who committed a low technical violation, whether they were admitted to a DOC facility or not. Comparing these percentages will indicate whether admission practices differ between racial/ethnic groups—that is, whether individuals of one race/ethnicity are more (or less) frequently admitted compared to others with the same risk level and violation record. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on supervision) or the date that the person was discharged from supervision.`,
    },
  ],
  filteredCaseTable: [
    {
      header: "What this list includes",
      body: `This is a list of people who fall within the filters that have been selected on the page. The default landing view includes all people who have been admitted to SCIs from parole during the time period selected. If the user has selected a different set of filters, this list will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "District 2" from the drop-down menus at the top of the screen, this list would automatically update to include only people from District 2.`,
    },
    {
      header: "District",
      body: `The district within which a person was under supervision during their last active supervision period prior to admission. For a small percentage of individuals (less than 0.5 percent), the district and agent are unknown. This happens when the individual was not associated with an active supervision period at any point within the two years prior to the admission.`,
    },
    {
      header: "Agent",
      body: `The most recent supervision agent the person was assigned to prior to admission.`,
    },
    {
      header: "Risk Level",
      body: `Risk level is defined based only on the LSI-R tool and no other assessment. Those without LSI-R scores are counted in the Unassessed category. LSI-R scores above 54 are not counted.`,
    },
    {
      header: "Last Recommendation",
      body: `The recommendation listed on the last violation report before the person was admitted. "Placement in DOC facilities" currently includes the following recommendations: Placement in CCC Half Way Back, Placement in PVC, Placement in D&A Detox Facility, Placement in Mental Health Facility, Placement in Violation Center County Prison, Community Parole Corrections Half Way Out.`,
    },
    {
      header: "Violation Record",
      body: `A summary of the most severe reported violation on each violation report filed within one year prior to the last reported violation before the person was admitted.`,
    },
  ],
};

export default { US_PA_METHODOLOGY };
