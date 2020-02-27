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
      header: 'What this chart shows',
      body: `This chart displays the total number of people who were admitted to prison during
        each month because their supervision was revoked by the parole board or the court.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
        people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
        (2) people who were admitted to prison for reasons aside from revocation, such as treatment
        or short term sanctions; and (3) people who have been detained pending a revocation hearing,
        but who have not been legally revoked. This chart (like all charts on the page) will
        automatically repopulate to match whatever filter(s) the user has selected. For example,
        if the user has selected district 2 and probation from the drop down menus at the top of
        the screen, this chart will automatically update to include only people from the probation
        population in District 2.`,
    },
  ],
  revocationMatrix: [
    {
      header: 'What this chart shows',
      body: `This chart plots all people who were revoked to prison during the time period
        selected by the user, according to their most serious violation and the number of
        violation reports and notices of citation filed within 12 months before the revocation.
        The user can select the time period for revocations included in the chart by using the
        drop down menu in the upper left hand corner of the page.`,
    },
    {
      header: 'Most serious violation',
      body: `Violations are listed in order of severity, starting with the least serious violation
        in the top row. A person's most serious violation is calculated by looking back at all
        violation reports and notices of citation filed within 12 months before the revocation and
        identifying the most serious violation listed in those reports. The most serious violation
        determines what row a person is placed in, regardless of whether it was the most recent
        violation. For example, if a person had one misdemeanor violation, then two technical
        violations, then one substance use violation, and then they were revoked, they would be
        placed in the misdemeanor row because misdemeanor is their most serious violation.`,
    },
    {
      header: 'Number of violation reports and notices of citation filed',
      body: `This is determined by counting the total number of violation reports and notices of
        citation that were filed within 12 months before the revocation. For example, if a person
        had one violation report and one notice of citation during the 12 months before the
        revocation, they would be in the “2” column. This is so even if the violation report listed
        several types of violations or conditions violated.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only people who were revoked to prison. It does not include
        (1) people who were revoked to termination or to a new form of supervision
        (i.e., SIS to SES); (2) people who were admitted to prison for reasons aside from
        revocation, such as treatment or short term sanctions; and (3) people who have been
        detained pending a revocation hearing, but who have not been legally revoked. This chart
        (like all charts on the page) will automatically repopulate to match whatever filters the
        user has selected. For example, if the user has selected District 2 and Probation from the
        drop down menus at the top of the screen, this chart will automatically update to include
        only people from the probation population in District 2.`,
    },
  ],
  revocationsByDistrict: [
    {
      header: 'What the count chart shows',
      body: `This chart shows the total number of people revoked to prison from each district
        during the time period selected on the revocation plot above. The districts are positioned
        in descending order from left to right, with the district with the highest number of people
        revoked at the left. If a person’s district is unknown (meaning they were not under active
        supervision in any district at the time of revocation), they are not included in the
        district counts or rates.`,
    },
    {
      header: 'What the rate chart shows',
      body: `This chart shows the revocation rate in each district over the past 30 days.
        Revocation rate is defined as the number of people revoked from that district divided by
        the total supervised population within that district. The districts are positioned in
        descending order from left to right, with the district with the highest revocation rate
        at the left.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
        people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
        (2) people who were admitted to prison for reasons aside from revocation, such as treatment
        or short term sanctions; and (3) people who have been detained pending a revocation hearing,
        but who have not been legally revoked. This chart (like all charts on the page) will
        automatically repopulate to match whatever filter(s) the user has selected. For example,
        if the user has selected district 2 and probation from the drop down menus at the top of
        the screen, this chart will automatically update to include only people from the probation
        population in District 2.`,
    },
  ],
  revocationsByRiskLevel: [
    {
      header: 'What this chart shows',
      body: `This chart shows the revocation rate for each risk level group. This is calculated as
        the number of people of each risk level who were revoked during the selected time period
        divided by the total number of people of that risk level. We define risk level based only
        on the Community Supervision Screening Tool and/or the Community Supervision Tool
        (if relevant) and no other assessment (i.e., Prison Intake Tool). Those without Community
        Supervision Screening Tool/Community Supervision Tool scores are counted in the Unassessed
        category.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
        people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
        (2) people who were admitted to prison for reasons aside from revocation, such as treatment
        or short term sanctions; and (3) people who have been detained pending a revocation hearing,
        but who have not been legally revoked. This chart (like all charts on the page) will
        automatically repopulate to match whatever filter(s) the user has selected. For example,
        if the user has selected district 2 and probation from the drop down menus at the top of
        the screen, this chart will automatically update to include only people from the probation
        population in District 2.`,
    },
    {
      header: 'Filtering by violation history',
      body: `If the user has filtered the page by clicking on a specific violation type
        (i.e., technical) or bubble (i.e., technical, 3) within the revocation plot, this chart
        will show revocation rates for people with the selected violation history by risk level.
        For example, if the user had selected the technical row on the revocations plot, the rate
        would be as follows: For each risk level, the number of people revoked whose most serious
        violation was a technical, divided by the total number of people whose most serious
        violation was a technical, including those who were not revoked. In calculating the number
        of people who were not revoked whose most serious violation was a technical, we look back
        for the same 12 month period as used to determine most serious violation in the revocations
        plot, from either the current date (if the person is still on supervision) or the date that
        the person was discharged from supervision.`,
    },
  ],
  revocationsByViolationType: [
    {
      header: 'What this chart shows',
      body: `This chart shows the relative frequency of each type of violation for people who were
        revoked to prison, looking back over a period 12 months before the revocation. This is
        calculated as the total number of times each type of violation was reported on all notices
        of citation and violation reports filed during that period, divided by the total number of
        notices of citation and violation reports filed during that period. For this chart, if
        multiple violations are listed on one report or notice of citation, they are all counted.
        The blue bars represent the different categories of conditions violated that constitute
        technical violations. The yellow bars represent different categories of law violations.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only violation records for people who were revoked to prison.
        Counts do not include (1) people who were revoked to termination or to a new form of
        supervision (i.e., SIS to SES); (2) people who were admitted to prison for reasons aside
        from revocation, such as treatment or short term sanctions; and (3) people who have been
        detained pending a revocation hearing, but who have not been legally revoked. This chart
        (like all charts on the page) will automatically repopulate to match whatever filters the
        user has selected. For example, if the user has selected district 2 and probation from the
        drop down menus at the top of the screen, this chart will automatically update to include
        only people from the probation population in District 2.`,
    },
  ],
  revocationsByGender: [
    {
      header: 'What the count chart shows',
      body: `This chart compares the revocation rates for women and men, overall and broken out by
        risk level. Gender and risk level specific revocation rates are calculated as the number of
        women (or men) revoked of a given risk level divided by the total number of women (or men)
        of the same risk level within the supervised population. Risk level is defined based only
        on the Community Supervision Screening Tool and/or the Community Supervision Tool (if
        relevant) and no other assessment (i.e., Prison Intake Tool). Those without Community
        Supervision Screening Tool/Community Supervision Tool scores are counted in the Unassessed
        category.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
        people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
        (2) people who were admitted to prison for reasons aside from revocation, such as treatment
        or short term sanctions; and (3) people who have been detained pending a revocation hearing,
        but who have not been legally revoked. This chart (like all charts on the page) will
        automatically repopulate to match whatever filter(s) the user has selected. For example,
        if the user has selected district 2 and probation from the drop down menus at the top of
        the screen, this chart will automatically update to include only people from the probation
        population in District 2.`,
    },
    {
      header: 'Filtering by violation history',
      body: `If the user has filtered the page by clicking on a specific violation type
        (i.e., technical) or bubble (i.e., technical, 3) within the revocation plot, this chart
        will show revocation rates for people with the selected violation history by risk level.
        For example, if the user had selected the technical row on the revocations plot, the rate
        would be as follows: For each risk level, the number of people revoked whose most serious
        violation was a technical, divided by the total number of people whose most serious
        violation was a technical, including those who were not revoked. In calculating the number
        of people who were not revoked whose most serious violation was a technical, we look back
        for the same 12 month period as used to determine most serious violation in the revocations
        plot, from either the current date (if the person is still on supervision) or the date that
        the person was discharged from supervision.`,
    },
  ],
  revocationsByRace: [
    {
      header: 'What the count chart shows',
      body: `This chart compares the revocation rates for people of each race/ethnicity, overall
        and broken out by risk level. Race or ethnicity and risk level specific revocation rates are
        calculated as the number of people of a given race or ethnicity and of a given risk level
        who were revoked divided by the total number of people of that race or ethnicity and of that
        risk level within the population. Risk level is defined based only on the Community
        Supervision Screening Tool and/or the Community Supervision Tool (if relevant) and no other
        assessment (i.e., Prison Intake Tool). Those without Community Supervision Screening
        Tool/Community Supervision Tool scores are counted in the Unassessed category.`,
    },
    {
      header: 'Who is included',
      body: `This chart includes only people who were revoked to prison. Counts do not include (1)
        people who were revoked to termination or to a new form of supervision (i.e., SIS to SES);
        (2) people who were admitted to prison for reasons aside from revocation, such as treatment
        or short term sanctions; and (3) people who have been detained pending a revocation hearing,
        but who have not been legally revoked. This chart (like all charts on the page) will
        automatically repopulate to match whatever filter(s) the user has selected. For example,
        if the user has selected district 2 and probation from the drop down menus at the top of
        the screen, this chart will automatically update to include only people from the probation
        population in District 2.`,
    },
    {
      header: 'Filtering by violation history',
      body: `If the user has filtered the page by clicking on a specific violation type
        (i.e., technical) or bubble (i.e., technical, 3) within the revocation plot, this chart
        will show revocation rates for people with the selected violation history by risk level.
        For example, if the user had selected the technical row on the revocations plot, the rate
        would be as follows: For each risk level, the number of people revoked whose most serious
        violation was a technical, divided by the total number of people whose most serious
        violation was a technical, including those who were not revoked. In calculating the number
        of people who were not revoked whose most serious violation was a technical, we look back
        for the same 12 month period as used to determine most serious violation in the revocations
        plot, from either the current date (if the person is still on supervision) or the date that
        the person was discharged from supervision.`,
    },
  ],
  filteredCaseTable: [
    {
      header: 'What this list includes',
      body: `This is a list of people who fall within the filters that have been selected on the
        page. In the default landing view, this includes all people who have been revoked to prison
        during the time period selected in the revocations plot. If the user has selected a
        different set of filters, this list will automatically repopulate to match whatever filters
        the user has selected. For example, if the user has selected district 2 and probation from
        the drop down menus at the top of the screen, this list would automatically update to
        include only people from the probation population in District 2.`,
    },
  ],
};

export {
  chartIdToInfo,
};
