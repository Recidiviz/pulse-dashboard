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
  revocationsOverTime: [
    {
      header: "What this chart shows",
      body: `This chart displays the total number of people who were admitted to prison during
each month due to revocation by the parole board or the court.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
(2) people who were admitted to prison for reasons aside from revocation, such as treatment
or short term sanctions; and (3) people who have been detained pending a revocation hearing,
but who have not been legally revoked. This chart (like all charts on the page) will
automatically repopulate to match whatever filter(s) the user has selected. For example,
if the user has selected "District 2" and "Probation" from the drop down menus at the top of
the screen, this chart will automatically update to include only people from the probation
population in District 2.`,
    },
  ],
  revocationMatrix: [
    {
      header: "What this chart shows",
      body: `This chart plots all people who were revoked to prison during the time period
selected by the user, according to their most serious violation and the total number of
violation reports and notices of citation. The user can select the time period for revocations
included in the chart by using the drop-down menu in the upper left corner of the page.
The most serious violation and total number of reported violations are determined by looking back
at all violation reports and notices of citation filed within one year prior to the last reported
violation before their revocation. For example, if the last violation a person committed occurred
on February 1, 2017, and they were revoked on January 15, 2018, the most serious violation and
number of violations would be determined by looking over the period of February 1, 2016 -
February 1, 2017. This methodology negates the lag time between the last violation report and the
court's decision to revoke, and therefore gives a fuller picture of a person's behavioral record
leading up to the decision to recommend revocation. Reports filed after the revocation are not
included, since they were presumptively irrelevant to the revocation. These violation counts
include citations as well as initial and interdistrict violation reports. No other types of
violation reports are included. Hence, if a person had three initial violation reports and one
supplemental report, they would be counted as having four violations. They would be categorized
according to the most severe violation reported in all of these reports, regardless of whether it
was in the initial report or supplemental report.`,
    },
    {
      header: "Most serious violation",
      body: `Violations, starting with the least serious, are listed in order of severity:
technical, substance use, municipal offense, absconsion, misdemeanor, felony. The most serious
violation determines what row a person is placed in, regardless of whether it was the most recent
violation. For example, if a person had one misdemeanor violation, then two technical violations,
then one substance use violation, and then they were revoked, they would be placed in the
misdemeanor row because a misdemeanor is their most serious violation.`,
    },
    {
      header: "Number of violation reports and notices of citation filed",
      body: `This is determined by counting the total number of violation reports and notices of
citation that were filed one year prior to the last reported violation before their revocation.
For example, if a person had one notice of citation on February 10, 2016 and one violation report
on February 1, 2017, and then they were revoked (without any new violations), they would be in the
"2" column. This is the case even if several types of violations or conditions violated were
listed within a single report.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only people who were revoked to prison. It does not include
(1) people who were revoked to termination or to a new form of supervision
(i.e., SIS to SES); (2) people who were admitted to prison for reasons aside from
revocation, such as treatment or short term sanctions; (3) people who have been
detained pending a revocation hearing, but who have not been legally revoked; and (4) people who
have zero violation reports and notices of citation within the year leading up to their revocation
(this is around 1% of the revoked population). This chart (like all charts on the page) will
automatically repopulate to match whatever filters the user has selected. For example, if the user
has selected "District 2" and "Probation" from the drop down menus at the top of the screen,
this chart will automatically update to include only people from the probation population in
District 2.`,
    },
  ],
  revocationsByDistrict: [
    {
      header: "What the count chart shows",
      body: `This chart shows the total number of people revoked to prison from each district
during the time period selected in the "Time Period" drop down menu. The districts are positioned
in descending order from left to right, with the district with the highest number of people
revoked at the left. If a person’s district is unknown (meaning they were not under active
supervision in any district within 2 years prior to the revocation), they are not included in the
district counts or rates.`,
    },
    {
      header: "What the percentage chart shows",
      body: `This chart shows the percentage of people revoked in each district. Percent revoked is
defined as the number of people revoked from that district in the selected time period divided by
the total supervised population within that district during the same time period. The districts are
positioned in descending order from left to right, with the district with the highest revocation
rate at the left. If a person’s district is unknown (meaning they were not under active
supervision in any district within 2 years prior to the revocation), they are not included in the
district counts or rates.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
(2) people who were admitted to prison for reasons aside from revocation, such as treatment
or short term sanctions; and (3) people who have been detained pending a revocation hearing,
but who have not been legally revoked. This chart (like all charts on the page) will
automatically repopulate to match whatever filter(s) the user has selected. For example,
if the user has selected "District 2" and "Probation" from the drop down menus at the top of
the screen, this chart will automatically update to include only people from the probation
population in District 2.`,
    },
  ],
  revocationsByRiskLevel: [
    {
      header: "What this chart shows",
      body: `This chart shows the percentage of people who were revoked in each risk level group.
This is calculated as the number of people of each risk level who were revoked divided by the total
number of people in that risk level. Risk level is based only on the Community Supervision
Screening Tool and/or the Community Supervision Tool (if relevant) and no other assessment
(i.e., Prison Intake Tool). Those without Community Supervision Screening Tool/Community
Supervision Tool scores are counted in the Unassessed category.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
(2) people who were admitted to prison for reasons aside from revocation, such as treatment
or short term sanctions; and (3) people who have been detained pending a revocation hearing,
but who have not been legally revoked. This chart (like all charts on the page) will
automatically repopulate to match whatever filter(s) the user has selected. For example,
if the user has selected "District 2" and "Probation" from the drop down menus at the top of
the screen, this chart will automatically update to include only people from the probation
population in District 2.`,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type
(i.e., technical) or bubble (i.e., technical, 3) within the revocation plot, this chart
will show the percentage of people revoked with the selected violation history by risk level.
For example, if the user had selected the technical row on the revocations plot, the chart
would show: For each risk level, the number of people revoked whose most serious
violation was a technical, divided by the total number of people whose most serious
violation was a technical, including those who were not revoked. Comparing these percentages will
indicate whether revocation practices are sensitive to risk level. That is, whether people who are
higher risk are likelier to be revoked than lower risk people who have similar violation
histories. For people who have not been revoked, the most serious violation is identified by
considering all violations reported within one year from either the current date (if the person
is still on supervision) or the date that the person was discharged from supervision.`,
    },
  ],
  revocationsByViolationType: [
    {
      header: "What this chart shows",
      body: `This chart shows the relative frequency of each type of violation among the selected
group. The blue bars represent the different categories of conditions violated that constitute
technical violations. The orange bars represent different categories of law violations. This is
calculated as follows: The total number of violation reports or notices of citation upon which each
type of violation appears, divided by the total number of violation reports or notices of citation
filed. Violation counts include all reported violations filed within one year of a person's last
violation before they were revoked. For this chart only, if multiple violation types are listed on
one violation report or notice of citation, they are all counted. For example, if a single notice of
citation lists both an employment violation and a reporting violation, both are counted. Hence the
total number of reported violations included in this chart will be larger than the total number of
violation reports and notices of citation. For example, if there were a total of 100 violation
reports and notices of citation, but each report listed 2 different violations, the denominator in
each percentage would still be 100. If, out of these 100 violation reports and notices of citation,
20 included at least one employment violation, then the percentage for employment violations would
be 20/100=10%.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only violation records for people who were revoked to prison.
Counts do not include (1) people who were revoked to termination or to a new form of
supervision (i.e., SIS to SES); (2) people who were admitted to prison for reasons aside
from revocation, such as treatment or short term sanctions; and (3) people who have been
detained pending a revocation hearing, but who have not been legally revoked. This chart
(like all charts on the page) will automatically repopulate to match whatever filters the
user has selected. For example, if the user has selected "District 2" and "Probation" from the
drop down menus at the top of the screen, this chart will automatically update to include
only people from the probation population in District 2.`,
    },
  ],
  revocationsByGender: [
    {
      header: "What this chart shows",
      body: `This chart compares the percent of women and men who were revoked, overall and broken
out by risk level. These percentages are calculated as follows: Overall and for each risk level,
the number of women (or men) revoked divided by the total number of women (or men) in that risk
level group. Risk level is defined based only on the Community Supervision Screening Tool and/or
the Community Supervision Tool (if relevant) and no other assessment (i.e., Prison Intake Tool).
Those without Community Supervision Screening Tool/Community Supervision Tool scores are counted
in the Unassessed category.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
(2) people who were admitted to prison for reasons aside from revocation, such as treatment
or short term sanctions; and (3) people who have been detained pending a revocation hearing,
but who have not been legally revoked. This chart (like all charts on the page) will
automatically repopulate to match whatever filter(s) the user has selected. For example,
if the user has selected "District 2" and "Probation" from the drop down menus at the top of
the screen, this chart will automatically update to include only people from the probation
population in District 2.`,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type
(i.e., technical) or bubble (i.e., technical, 3) within the revocation plot, this chart will show
the percent of people with the selected violation history who were revoked, for each gender and
risk level group. For example, if the user selected the technical row on the revocations plot, the
chart would show: For men and women overall, and for each risk level, the number of people revoked
whose most serious violation was a technical, divided by the total number of people whose most
serious violation was a technical, including those who were not revoked. Comparing these percentages
is an indicator of whether revocation practices differ between men and women. That is, whether men
are likelier (or less likely) to be revoked compared to women with the same risk level and violation
record. For people who have not been revoked, the most serious violation is identified by
considering all violations reported within one year from either the current date (if the person is
still on supervision) or the date that the person was discharged from supervision.`,
    },
  ],
  revocationsByRace: [
    {
      header: "What this chart shows",
      body: `This chart compares the percent of people in each race/ethnicity group who were
revoked, overall and broken out by risk level. These percentages are calculated as follows: Overall
and for each risk level, the number of people of a given race/ethnicity revoked divided by the total
number of people of a given race/ethnicity in that risk level group. Risk level is defined based
only on the Community Supervision Screening Tool and/or the Community Supervision Tool (if relevant)
and no other assessment (i.e., Prison Intake Tool). Those without Community Supervision Screening
Tool/Community Supervision Tool scores are counted in the Unassessed category.`,
    },
    {
      header: "Who is included",
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
(2) people who were admitted to prison for reasons aside from revocation, such as treatment
or short term sanctions; and (3) people who have been detained pending a revocation hearing,
but who have not been legally revoked. This chart (like all charts on the page) will
automatically repopulate to match whatever filter(s) the user has selected. For example,
if the user has selected "District 2" and "Probation" from the drop down menus at the top of
the screen, this chart will automatically update to include only people from the probation
population in District 2.`,
    },
    {
      header: "Filtering by violation history",
      body: `If the user has filtered the page by clicking on a specific violation type
(i.e., technical) or bubble (i.e., technical, 3) within the revocation plot, this chart will show
percent of people with the selected violation history who were revoked, for each race/ethnicity and
risk level. For example, if the user selected the technical row on the revocations plot, the chart
would show: Overall and for each risk level, the number of people of each race/ethnicity who were
revoked whose most serious violation was a technical, divided by the total number of people of that
race/ethnicity whose most serious violation was a technical, including those who were not revoked.
Comparing these percentages is an indicator of whether revocation practices differ between
racial/ethnic groups. That is, whether individuals of one race/ethnicity are more likely (or less
likely) to be revoked compared to others with the same risk level and violation record. For people
who have not been revoked, the most serious violation is identified by considering all violations
reported within one year from either the current date (if the person is still on supervision) or
the date that the person was discharged from supervision.`,
    },
  ],
  filteredCaseTable: [
    {
      header: "What this list includes",
      body: `This is a list of people who fall within the filters that have been selected on the
page. In the default landing view, this includes all people who have been revoked to prison
during the time period selected in the revocations plot. If the user has selected a
different set of filters, this list will automatically repopulate to match whatever filters
the user has selected. For example, if the user has selected "District 2" and "Probation" from
the drop down menus at the top of the screen, this list would automatically update to
include only people from the probation population in District 2.`,
    },
    {
      header: "District",
      body: `The district within which a person was under supervision during their last active
supervision period prior to revocation. For a small percentage of individuals (approx. 4–8 percent),
the district and officer are unknown. This happens when the individual was not associated with an
active supervision period at any point within the two years prior to the revocation.`,
    },
    {
      header: "Officer",
      body: `The most recent supervision officer the person was assigned to prior to revocation.`,
    },
    {
      header: "Risk Level",
      body: `Risk level is defined based only on the Community Supervision Screening Tool and/or
the Community Supervision Tool (if relevant) and no other assessment (i.e., Prison Intake Tool).
Those without Community Supervision Screening Tool/Community Supervision Tool scores are counted
in the Unassessed category.`,
    },
    {
      header: "Officer Recommendation",
      body: `The most severe "Recommendation" on the reports filed within one year prior to the
last reported violation before the person was revoked. The recommendations are ranked in severity
in the following order: Revocation, Privileges Revoked (SIS to SES), Extension, Suspension, Service
Termination, Delayed Action, Continuance.`,
    },
    {
      header: "Violation Record",
      body: `A summary of all reported violations in violation reports and notices of citation
filed within one year prior to the last reported violation before the person was revoked.`,
    },
  ],
};

export default chartIdToInfo;
