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
      id: 1,
      header: "What this chart shows",
      body: `This chart displays the total number of people who were admitted on a board action to an SCI, CCC, or Contract Facility from parole during each month.`,
    },
    {
      id: 2,
      header: "Who is included",
      body: `Counts include people who were admitted on a board action to SCIs, CCCs, or Contract Facilities from parole. This includes people on parole who were admitted under Act 122 and those who were admitted for revocation. For those admitted under Act 122, individuals for whom their commitment length is unknown will be placed in the "SCI <6 MONTHS" category. The SCI commitment length may be unknown when an individual has a recorded admission to a CCC or Contract Facility with the "Program 46" code, but there is missing data for the corresponding board action specifying the length of stay mandated by the parole board. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility. Person-based counts are used throughout the dashboard, so if a single individual has multiple admissions in the selected time period, the dashboard counts their most recent admission. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district.`,
    },
  ],
  admissionMatrix: [
    {
      id: 1,
      header: "What this chart shows",
      body: `This chart plots people who were admitted on a board action to an SCI, CCC, or Contract Facility from parole during the time period selected by the user, according to their most serious violation and the total number of violation reports. The user can select the time period for admissions included in the chart by using the drop-down menu in the upper left corner of the page. The most serious violation and total number of reported violations are determined by looking back at all violation reports filed within one year prior to the last reported violation before their admission. For example, if the last violation a person committed occurred on February 1, 2017, and they were admitted on January 15, 2018, the most serious violation and number of violations would be determined by looking over the period of February 1, 2016–February 1, 2017. This methodology negates the lag time between the last violation report and the board action, and therefore gives a fuller picture of a person's behavioral record leading up to the admission decision. Reports filed after the admission are not included, since they were presumptively irrelevant to the admission.`,
    },
    {
      id: 2,
      header: "Most serious violation",
      body: `Violations, starting with the least serious, are listed in order of severity: low technical, medium technical, electronic monitoring, substance use, absconding, high technical, law violation. The most serious violation determines what row a person is placed in, regardless of whether it was the most recent violation. For example, if a person had one law violation, then two low technical violations, then one substance use violation, and then they were admitted, they would be placed in the law violation row because a law violation is their most serious violation.`,
    },
    {
      id: 3,
      header: "Number of violation reports filed",
      body: `This is determined by counting the total number of reports that were filed one year prior to the last reported violation before their admission. For example, if a person had one violation report on February 10, 2016, and one violation report  on February 1, 2017, and then they were admitted (without any new violations), they would be in the "2" column. This is the case even if several types of violations or conditions violated were listed within a single report.`,
    },
    {
      id: 4,
      header: "Who is included",
      body: `Counts include people who were admitted on a board action to SCIs, CCCs, or Contract Facilities from parole. This includes people on parole who were admitted under Act 122 and those who were admitted for revocation. For those admitted under Act 122, individuals for whom their commitment length is unknown will be placed in the "SCI <6 MONTHS" category. The SCI commitment length may be unknown when an individual has a recorded admission to a CCC or Contract Facility with the "Program 46" code, but there is missing data for the corresponding board action specifying the length of stay mandated by the parole board. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility. Person-based counts are used throughout the dashboard, so if a single individual has multiple admissions in the selected time period, the dashboard counts their most recent admission. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district.`,
    },
  ],
  admissionsByDistrict: [
    {
      id: 1,
      header: `What the "Admission count" chart shows`,
      body: ` This chart shows the total number of people admitted on a board action to an SCI, CCC, or Contract Facility from parole from each sub-office during the time period selected in the "Time Period" drop-down menu. The sub-offices are positioned in descending order from left to right, with the sub-office with the highest number of people admitted at the left. If a person's sub-office is unknown (meaning they were not under active supervision in any sub-office within two years prior to their admission), they are not included in the sub-office counts or rates.`,
    },
    {
      id: 2,
      header: `What the "Admission rate of standing population" chart shows`,
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the admission rate from parole in each sub-office. Admission rate is defined as the number of people admitted from that sub-office in the selected time period divided by the total supervised population within that sub-office during the same time period. The sub-offices are positioned in descending order from left to right, with the sub-office with the highest admission rate at the left. If a person's sub-office is unknown (meaning they were not under active supervision within two years prior to their admission), they are not included in the sub-office counts or rates. When hovering over any sub-office column, users can see the total number of people on supervision in that sub-office as the denominator and the total number of people admitted in that sub-office as the numerator.`,
    },
    {
      id: 3,
      header: "Who is included",
      body: ` Counts include people who were admitted on a board action to SCIs, CCCs, or Contract Facilities from parole. This includes people on parole who were admitted under Act 122 and those who were admitted for revocation. For those admitted under Act 122, individuals for whom their commitment length is unknown will be placed in the "SCI <6 MONTHS" category. The SCI commitment length may be unknown when an individual has a recorded admission to a CCC or Contract Facility with the "Program 46" code, but there is missing data for the corresponding board action specifying the length of stay mandated by the parole board. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility. Person-based counts are used throughout the dashboard, so if a single individual has multiple admissions in the selected time period, the dashboard counts their most recent admission. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district.`,
    },
    {
      id: 4,
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, this chart will show the percentage of people admitted with the selected violation history among those with a similar violation history within each sub-office. For example, if the user selected the low technical row on the plot, the chart would show for each sub-office, the number of people admitted whose most serious violation was a low technical, divided by the total number of people on supervision whose most serious violation was a low technical, regardless of whether they were admitted. Continuing with this example, if a user hovers over the sub-office column, the numerator would be all people admitted for a low technical violation in that sub-office, and the denominator would be all people who committed a low technical violation, whether they were admitted to a DOC facility or not. Comparing these percentages will indicate whether admission practices differ by sub-office for various violation histories. That is, whether people with similar violation histories are admitted more frequently in one sub-office than another. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on supervision) or the date that the person was discharged from supervision.`,
    },
  ],
  admissionsByAgent: [
    {
      id: 1,
      header: `What the "Admission count" chart shows`,
      body: `This chart shows the total number of people admitted on a board action to an SCI, CCC, or Contract Facility from parole by the 50 supervision agents with the most admissions during the time period selected in the "Time Period" drop-down menu. Supervision agents are positioned in descending order from left to right, with the agent with the highest number of people admitted from supervision at the left. If the chart shows fewer than 50 bars, there were less than 50 agents who had admissions during the selected time period. The agent associated with each admission from supervision is based on the agent who was assigned most recently to a supervision case at the time of admission. `,
    },
    {
      id: 2,
      header: `What the "Admission rate of standing population" chart shows`,
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the percentage of people on supervision admitted on a board action to an SCI, CCC, or Contract Facility from parole from each supervision agent's caseload. Admission rate of standing population is defined as the number of people admitted on a board action to an SCI, CCC, or Contract Facility from parole per agent divided by the total number of people supervised by each agent. The 50 supervision agents with the highest admission rate are positioned in descending order from left to right. If the chart shows fewer than 50 bars, there were less than 50 agents who had admissions during the selected time period. Agents with fewer than 10 total people on their supervision caseload for the specified time period are excluded from this chart. The agent associated with each admission from supervision is based on the agent who most recently was assigned to a supervision case at the time of admission. When hovering over any agent column, users can see the total number of people on supervision on that agent's caseload as the denominator and the total number of people admitted from that agent's caseload as the numerator. Agent caseloads vary widely, so admission rates by agent may be based on a relatively small number of cases and therefore less generalizable.`,
    },
    {
      id: 3,
      header: "Who is included",
      body: `Counts include people who were admitted on a board action to SCIs, CCCs, or Contract Facilities from parole. This includes people on parole who were admitted under Act 122 and those who were admitted for revocation. For those admitted under Act 122, individuals for whom their commitment length is unknown will be placed in the "SCI <6 MONTHS" category. The SCI commitment length may be unknown when an individual has a recorded admission to a CCC or Contract Facility with the "Program 46" code, but there is missing data for the corresponding board action specifying the length of stay mandated by the parole board. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility. Person-based counts are used throughout the dashboard, so if a single individual has multiple admissions in the selected time period, the dashboard counts their most recent admission. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district.`,
    },
    {
      id: 4,
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, this chart will show the percentage of people admitted with the selected violation history among those with a similar violation history within an agent's caseload. For example, if the user selected the low technical row on the plot, the chart would show for each agent, the number of people admitted whose most serious violation was a low technical, divided by the total number of people supervised by that agent whose most serious violation was a low technical, regardless of whether they were admitted. Continuing with this example, if a user hovers over the agent column, the numerator would show all people admitted for a low technical violation on that agent's caseload, and the denominator would show all people on that agent's caseload who committed a low technical violation, whether they were admitted to an SCI/CCC/Contract Facility or not. Comparing these percentages will indicate whether admission practices differ by agent for various violation histories. That is, whether people with similar violation histories are admitted more frequently by one agent than another. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on supervision) or the date that the person was discharged from supervision.
      `,
    },
  ],
  admissionsByRiskLevel: [
    {
      id: 1,
      header: "What this chart shows",
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the percentage of people who were admitted in each risk level group. This is calculated as the number of people in each risk level who were admitted divided by the total number of people on supervision at that risk level. Risk level is defined based only on the LSI-R tool and no other assessment. Those without LSI-R scores are counted in the "No Score" category. LSI-R scores above 54 are not counted. When hovering over any risk column, users can see the total number of people on supervision assessed at that specific risk level as the denominator and the total number of people admitted at that risk level as the numerator.`,
    },
    {
      id: 2,
      header: "Who is included",
      body: `Counts include people who were admitted on a board action to SCIs, CCCs, or Contract Facilities from parole. This includes people on parole who were admitted under Act 122 and those who were admitted for revocation. For those admitted under Act 122, individuals for whom their commitment length is unknown will be placed in the "SCI <6 MONTHS" category. The SCI commitment length may be unknown when an individual has a recorded admission to a CCC or Contract Facility with the "Program 46" code, but there is missing data for the corresponding board action specifying the length of stay mandated by the parole board. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility. Person-based counts are used throughout the dashboard, so if a single individual has multiple admissions in the selected time period, the dashboard counts their most recent admission. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district. `,
    },
    {
      id: 3,
      header: "Filtering by violation history",
      body: ` If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, this chart will show the percentage of people admitted with the selected violation history among those on supervision with the same risk level. For example, if the user selected the low technical row on the plot, the chart would show for each risk level, the number of people admitted whose most serious violation was a low technical, divided by the total number of people on supervision whose most serious violation was a low technical, regardless of whether they were admitted. Continuing with this example, if a user hovers over the low-risk column, the numerator would be all low-risk people admitted for a low technical violation, and the denominator would be all low-risk people who committed a low technical violation, whether they were admitted to a DOC facility or not. Comparing these percentages will indicate whether admission practices are sensitive to risk level. That is, whether people who are higher risk are admitted more frequently than lower-risk people who have similar violation histories. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on supervision) or the date that the person was discharged from supervision.
      `,
    },
  ],
  admissionsByViolationType: [
    {
      id: 1,
      header: "What this chart shows",
      body: `This chart shows the relative frequency of each type of violation among the selected group. The blue bars represent the different categories of conditions violated that constitute technical violations. The orange bars represent law violations. This is calculated as follows: the total number of violation reports upon which each type of violation appears, divided by the total number of violation reports filed. Violation counts include all reported violations filed within one year of a person's last violation before they were admitted. For this chart only, if multiple violation types are listed on one violation report, they are all counted. For example, if a single violation report lists both an absconsion violation and an electronic monitoring violation, both are counted. Hence the total number of reported violations included in this chart will be larger than the total number of violation reports. For example, if there were a total of 100 violation reports, but each report listed 2 different violations, the denominator in each percentage would still be 100. If, out of these 100 violation reports, 20 included at least one employment violation, then the percentage for employment violations would be 20/100=20 percent.`,
    },
    {
      id: 2,
      header: "Who is included",
      body: `Counts include people who were admitted on a board action to SCIs, CCCs, or Contract Facilities from parole. This includes people on parole who were admitted under Act 122 and those who were admitted for revocation. For those admitted under Act 122, individuals for whom their commitment length is unknown will be placed in the "SCI <6 MONTHS" category. The SCI commitment length may be unknown when an individual has a recorded admission to a CCC or Contract Facility with the "Program 46" code, but there is missing data for the corresponding board action specifying the length of stay mandated by the parole board. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility. Person-based counts are used throughout the dashboard, so if a single individual has multiple admissions in the selected time period, the dashboard counts their most recent admission. This chart (like all charts on the page) will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district. `,
    },
  ],
  admissionsBySex: [
    {
      id: 1,
      header: "What this chart shows",
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the percent of each sex who were admitted, on supervision, and in Pennsylvania's general population. At a high level, comparing these percentages can indicate whether a given sex is over- or under-represented when compared to the broader population. If an individual does not have a known sex, they are excluded from this chart.`,
    },
    {
      id: 2,
      body: `"Pennsylvania Population" refers to the number of individuals of the selected sex divided by the total number of people in Pennsylvania, according to the US Census Bureau. This value stays the same regardless of whether any filters are selected on the page.`,
    },
    {
      id: 3,
      body: `The "Supervision Population" refers to the number of individuals of the selected sex divided by the total number of people on parole supervision during the selected time period. `,
    },
    {
      id: 4,
      body: `"Admitted Population" refers to the number of individuals of the selected sex who were admitted on a board action to an SCI, CCC, or Contract Facility from parole divided by the total number of people admitted on a board action to an SCI, CCC, or Contract Facility from parole during the selected time period. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility.`,
    },
    {
      id: 5,
      body: `If a specific district is selected, "Admitted population" and the "Parole Population" will only include individuals currently assigned to or terminated by an agent from that district.`,
    },
    {
      id: 6,
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, the groups of "Admitted Population" and "Supervision Population" groups will be updated. If a user selected the row "Low tech.", the denominator of "Admitted Population" will now only be people who were admitted with a most serious violation of low technical, and the numerator would be the subset of people who are of the selected sex and who have been admitted with a most serious violation of a low technical. Similarly, with the above example, the "Supervision Population" denominator would now be all people on parole who committed a low technical violation, whether or not they were admitted, and the numerator would be the subset of that population who were of the specified sex. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on parole) or the date that the person was discharged from parole.`,
    },
  ],
  admissionsByRace: [
    {
      id: 1,
      header: "What this chart shows",
      body: `When no violation history filters are selected in the "Admissions by violation history" plot, this chart shows the percent of people in each race/ethnicity who were admitted, on supervision, and in Pennsylvania's general population. At a high level, comparing these percentages can indicate whether a given race/ethnicity is over- or under-represented when compared to the broader population. If an individual has more than one race/ethnicity recorded from different data systems, they are counted toward the least common race/ethnicity in the state. For example, if the individual is Caucasian and African American, they would count in the African American selection because there are fewer African Americans than Caucasians in the state. If an individual does not have a known race/ethnicity, they are excluded from this chart.`,
    },
    {
      id: 2,
      body: `"Pennsylvania Population" refers to the number of individuals of the selected race/ethnicity divided by the total number of people in Pennsylvania, according to the US Census Bureau. This value stays the same regardless of whether any filters are selected on the page.`,
    },
    {
      id: 3,
      body: `The "Supervision Population" refers to the number of individuals of the selected race/ethnicity divided by the total number of people on parole supervision during the selected time period`,
    },
    {
      id: 4,
      body: `"Admitted Population" refers to the number of individuals of the selected race/ethnicity who were admitted on a board action to an SCI, CCC, or Contract Facility from parole divided by the total number of people admitted on a board action to an SCI, CCC, or Contract Facility from parole during the selected time period. Counts do not include (1) people with Parole Violator Pending status - admissions for these individuals are counted on the date their status changes to Convicted Parole Violator or Technical Parole Violator; (2) people who are serving a State Indeterminate Punishment sentence; (3) people admitted for treatment in a CCC or Contract Facility.`,
    },
    {
      id: 5,
      body: `If a specific district is selected, "Admitted Population" and the "Supervision Population" will only include individuals currently assigned to or terminated by an agent from that district.`,
    },
    {
      id: 6,
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type (i.e., low technical) or bubble (i.e., low technical and three violation reports) within the "Admissions by violation history" plot, the groups of "Admitted Population" and "Supervision Population" groups will be updated. If a user selected the row "Low tech.", the denominator of "Admitted Population" will now only be people who were admitted with a most serious violation of low technical, and the numerator would be the subset of people who are of the selected race/ethnicity and who have been admitted with a most serious violation of a low technical. Similarly, with the above example, the "Supervision Population" denominator would now be all people on parole who committed a low technical violation, whether or not they were admitted, and the numerator would be the subset of that population who were of the specified race/ethnicity. For people who have not been admitted, the most serious violation is identified by considering all violations reported within one year from either the current date (if the person is still on parole) or the date that the person was discharged from parole.`,
    },
  ],
  filteredCaseTable: [
    {
      id: 1,
      header: "What this list includes",
      body: `This is a list of people who fall within the filters that have been selected on the page. The default landing view includes people who have been admitted on a board action to an SCI, CCC, or Contract Facility from parole during the time period selected. If the user has selected a different set of filters, this list will automatically repopulate to match whatever filter(s) the user has selected. For example, if the user has selected "01 - PHILADELPHIA" from the drop-down menus at the top of the screen, this chart will automatically update to include only people from the Philadelphia district. `,
    },
    {
      id: 2,
      header: "District",
      body: `The district within which a person was under supervision during their last active supervision period prior to admission. For a small percentage of individuals the district and agent are unknown. This happens when an  individual was not associated with an active supervision period at any point within the two years prior to the admission or there was never a recorded PO assignment during the supervision term preceding admission.`,
    },
    {
      id: 3,
      header: "Agent",
      body: `The most recent supervision agent the person was assigned to prior to admission.`,
    },
    {
      id: 4,
      header: "Risk Level",
      body: `Risk level is defined based only on the LSI-R tool and no other assessment. Those without LSI-R scores are counted in the "No Score" category. LSI-R scores above 54 are not counted.`,
    },
    {
      id: 5,
      header: "Violation Record",
      body: ` A summary of the most severe reported violation on each violation report filed within one year prior to the last reported violation before the person was admitted.`,
    },
  ],
};

export default { US_PA_METHODOLOGY };
