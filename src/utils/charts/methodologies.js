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

import React from "react";

const methodologies = {
  revocationCountsByMonth: (
    <div>
      <ul>
        <li>
          Revocations are included based on when the person was admitted to a
          DOCR facility, not when the violation, offense, or revocation
          occurred.
        </li>
        <li>
          When &quot;rate&quot; is selected, the chart shows the percent of the
          total supervised population incarcerated due to supervision
          revocation. For the percent of cases closed via revocation, see the
          &quot;Case terminations by month&quot; chart.
        </li>
        <li>
          When a supervision type and/or office is selected, the rate is the
          number of people with revocations who match the selected filters
          divided by the total number of people on supervision who also match
          the selected filters.
        </li>
        <li>
          Revocations are considered probation revocations or parole revocations
          based on the DOCR admission reason. Because only one reason can be
          selected, an individual&apos;s revocation will count only towards
          EITHER parole or probation even if they were on both parole and
          probation prior to incarceration.
        </li>
        <li>
          Revocations are attributed to the site of the terminating officer on
          the revocation in Docstars. Revocation admissions that can&apos;t be
          matched to a supervision case are not attributed to an office.
        </li>
        <li>
          Revocations are attributed to the site of the terminating officer at
          the time of a person&apos;s revocation.
        </li>
      </ul>
    </div>
  ),

  supervisionSuccessSnapshot: (
    <div>
      <ul>
        <li>
          A supervision is considered successfully completed if the individual
          was discharged from supervision positively or if their supervision
          period expired.
        </li>
        <li>
          Unsuccessful completions of supervision occur when the supervision
          ends due to absconsion, a revocation, or a negative termination.
        </li>
        <li>
          Deaths, suspensions, and &quot;other&quot; terminations are excluded
          from these calculations because they&apos;re neither
          &quot;successful&quot; nor &quot;unsuccessful&quot;.
        </li>
        <li>
          Individuals are counted in their month of projected completion, even
          if terminated earlier. Individuals who have not yet completed
          supervision by their projected termination date are excluded.
        </li>
        <li>
          While on supervision, individuals are attributed to the office of
          their current supervising officer. Following supervision, individuals
          are attributed to the office of the officer who terminated their
          supervision.
        </li>
      </ul>
    </div>
  ),

  lsirScoreChangeSnapshot: (
    <div>
      <ul>
        <li>
          For all individuals ending supervision in a given month who have at
          least 3 LSI-R assessments (initial assessment, first re-assessment,
          and terminating assessment), this is the average of the differences
          between the first reassessment score and the termination assessment
          score.
        </li>
        <li>Individuals are included regardless of termination reason.</li>
        <li>
          Individuals are linked to the office of their terminating officer.
        </li>
      </ul>
    </div>
  ),

  revocationAdmissionsSnapshot: (
    <div>
      <ul>
        <li>
          Prison admissions include individuals who are newly incarcerated in
          DOCR facilities. Transfers, periods of temporary custody, returns from
          escape and/or erroneous releases are not considered admissions.
        </li>
        <li>
          Prison admissions are categorized as probation revocations, parole
          revocations, or new admissions. New admissions are admissions for a
          reason other than revocation.
        </li>
        <li>
          Selecting an office or supervision type narrows down revocations to be
          revocations from that office and/or supervision type.
        </li>
        <li>
          &quot;Rate&quot; displays the percent of all admissions that occurred
          by supervision revocation. When a supervision type and/or office is
          selected, the chart displays the percent of all admissions that were
          revocations from that office and/or supervision type.
        </li>
      </ul>
    </div>
  ),

  revocationsByOfficer: (
    <div>
      <ul>
        <li>
          Revocations are counted towards an officer if that officer is flagged
          as the terminating officer at the time of a person&apos;s revocation.
        </li>
        <li>
          When an individual has multiple violation types leading to revocation,
          we display only the most severe violation. New offenses are considered
          more severe than absconsions, which are considered more severe than
          technicals.
        </li>
        <li>
          Revocations are included based on the date that the person was
          admitted to a DOCR facility because their supervision was revoked, not
          the date of the causal violation or offense.
        </li>
        <li>
          The revocation rate refers to the percent of an officer’s total
          revocation count caused by each violation type.
        </li>
      </ul>
    </div>
  ),

  admissionCountsByType: (
    <div>
      <ul>
        <li>
          Admissions include people admitted to DOCR facilities during a
          particular time frame, regardless of whether they were previously
          incarcerated. Transfers, periods of temporary custody, returns from
          escape and/or erroneous releases are not considered admissions.
        </li>
        <li>
          Prison admissions are categorized as probation revocations, parole
          revocations, or new admissions. New admissions are admissions
          resulting from a reason other than revocation.
        </li>
        <li>
          &quot;Technical Revocations&quot; include only those revocations which
          result solely from a technical violation. If there is a violation that
          includes a new offense or an absconsion, it is considered a
          &quot;Non-Technical Revocation&quot;.
        </li>
        <li>
          Revocations of &quot;Unknown Type&quot; indicate individuals who were
          admitted to prison for a supervision revocation where the violation
          that caused the revocation cannot yet be determined. Revocation
          admissions are linked to supervision cases closed via revocation
          within 90 days of the admission. Revocation admissions without a
          supervision case closed via revocation in this window will always be
          considered of &quot;Unknown Type.&quot;
        </li>
        <li>
          Filtering the chart by supervision type and/or P&P office impacts only
          the revocation admission counts. New admissions include individuals
          not previously on supervision and thus cannot be filtered by office or
          supervision type.
        </li>
        <li>
          Revocations are attributed to the site of the terminating officer on
          the revocation in Docstars. Revocation admissions that can&apos;t be
          matched to a supervision case are not attributed to an office.
        </li>
        <li>
          Revocations are considered either probation revocations or parole
          revocations based on the DOCR admission reason; a revocation cannot be
          categorized as both.
        </li>
      </ul>
    </div>
  ),

  revocationsBySupervisionType: (
    <div>
      <ul>
        <li>
          Percentage shows the percent of revocations in a month associated with
          individuals on parole versus the percent associated with individuals
          on probation.
        </li>
        <li>
          Revocations are included based on the date that the person was
          admitted to a DOCR facility because their supervision was revoked, not
          the date of the causal violation or offense.
        </li>
        <li>
          Revocations are considered probation revocations or parole revocations
          based on the DOCR admission reason. Because only one reason can be
          selected, an individual&apos;s revocation will count only towards
          EITHER parole or probation even if they were on both parole and
          probation prior to incarceration.
        </li>
        <li>
          Filtering by office counts revocation admissions linked to supervision
          revocations where the terminating officer is in the selected office.
          Revocation admissions that can&apos;t be matched to a supervision case
          are not attributed to an office.
        </li>
      </ul>
    </div>
  ),

  revocationsByViolationType: (
    <div>
      <ul>
        <li>
          Revocations are included based on the date that the person was
          admitted to a DOCR facility because their supervision was revoked, not
          the date of the supervision case closure or causal violation or
          offense.
        </li>
        <li>
          Revocation counts include the number of people who were incarcerated
          in a DOCR facility because their supervision was revoked.
        </li>
        <li>
          Percentage is the percent of revocations in a given month caused by
          each violation type.
        </li>
        <li>
          When an individual has multiple violation types leading to revocation,
          we display only the most severe violation. New offenses are considered
          more severe than absconsions, which are considered more severe than
          technicals.
        </li>
        <li>
          Violations of &quot;Unknown Type&quot; indicate individuals who were
          admitted to prison for a supervision revocation where the violation
          that caused the revocation cannot yet be determined. Revocation
          admissions are linked to supervision cases closed via revocation
          within 90 days of the admission. Revocation admissions without a
          supervision case closed via revocation in this window will always be
          considered of &quot;Unknown Type.&quot;
        </li>
        <li>
          Revocations are attributed to the site of the terminating officer on
          the revocation in Docstars. Revocation admissions that can&apos;t be
          matched to a supervision case are not attributed to an office.
        </li>
        <li>
          Revocations are considered probation revocations or parole revocations
          based on the DOCR admission reason. Because only one reason can be
          selected, an individual&apos;s revocation will count only towards
          EITHER parole or probation even if they were on both parole and
          probation prior to incarceration.
        </li>
      </ul>
    </div>
  ),

  revocationsByRace: (
    <div>
      <ul>
        <li>
          The &quot;Supervision Population&quot; refers to individuals meeting
          the criteria selected up top. At its most general, this is all
          individuals on parole or probation in North Dakota at any point during
          this time period.
        </li>
        <li>
          Revocation counts include the number of people who were incarcerated
          in a DOCR facility because their supervision was revoked.
        </li>
        <li>
          If a supervision type (parole or probation) is selected, the
          revocation and supervision populations will only count individuals
          meeting that criteria. Revocations are classified as either a parole
          revocation or a probation revocation based on the admission reason.
          Individuals can, however, appear in both the parole supervision
          population and the probation supervision population if they have both
          parole & probation active supervision cases.
        </li>
        <li>
          If a P&P office is selected, the supervision population and the
          revocation count will only include individuals currently assigned to
          or terminated by an officer from that office.
        </li>
        <li>Source of race proportions in ND: US Census Bureau.</li>
        <li>
          If an individual has more than one race or ethnicity recorded from
          different data systems, they are counted once for each unique race and
          ethnicity. This means that the total count in this chart may be larger
          than the total number of individuals it describes.
        </li>
      </ul>
    </div>
  ),

  caseTerminationsByTerminationType: (
    <div>
      <ul>
        <li>
          This chart includes counts based on case, not person. If a person on
          supervision has multiple cases, each case termination will be counted
          in the chart.
        </li>
        <li>
          Case terminations are included based on termination date in Docstars.
        </li>
        <li>
          Revocations are included based on a termination type of revocation in
          Docstars. Unlike other revocation counts, this chart
          <span className="font-weight-bold"> does not </span>
          only examine revocations resulting in admission to a DOCR facility.
        </li>
        <li>
          Absconsion is all cases terminated with termination code 13.
          Revocation is all cases terminated with code 9 or 10. Suspension is
          cases terminated with code 3 or 6. Discharge is cases terminated with
          code 1, 2, 5, 8, 12, 15, 16, 17, or 18. Expiration is cases terminated
          with code 4, 7, 19, or 20. Death is cases terminated with code 11.
          Other is cases terminated with code 14.
        </li>
        <li>
          Case terminations are attributed to the P&P office of the terminating
          officer in Docstars.
        </li>
      </ul>
    </div>
  ),

  caseTerminationsByOfficer: (
    <div>
      <ul>
        <li>
          This chart includes counts based on case, not person. If a person on
          supervision has multiple cases, each case termination will be counted
          in the chart.
        </li>
        <li>
          Case terminations are included based on termination date in Docstars.
        </li>
        <li>
          Revocations are included based on a termination type of revocation in
          Docstars. Unlike other revocation counts, this chart
          <span className="font-weight-bold"> does not </span>
          only examine revocations resulting in admission to a DOCR facility.
        </li>
        <li>
          Absconsion is all cases terminated with termination code 13.
          Revocation is all cases terminated with code 9 or 10. Suspension is
          cases terminated with code 3 or 6. Discharge is cases terminated with
          code 1, 2, 5, 8, 12, 15, 16, 17, or 18. Expiration is cases terminated
          with code 4, 7, 19, or 20. Death is cases terminated with code 11.
          Other is cases terminated with code 14.
        </li>
        <li>
          Case terminations are attributed to the terminating officer in
          Docstars.
        </li>
      </ul>
    </div>
  ),

  daysAtLibertySnapshot: (
    <div>
      <ul>
        <li>
          An individual&apos;s days at liberty are the number of days between
          release from incarceration and readmission for someone who was
          reincarcerated in a given month.
        </li>
        <li>
          An admission to prison counts as a reincarceration if the person has
          been incarcerated previously in a North Dakota prison.
        </li>
      </ul>
    </div>
  ),

  reincarcerationCountsByMonth: (
    <div>
      <ul>
        <li>
          An admission to prison counts as a reincarceration if the person has
          been incarcerated previously in a North Dakota prison.
        </li>
        <li>
          Reincarcerations are included regardless of when the initial
          incarceration took place. There is no upper bound on the follow up
          period in this metric.
        </li>
        <li>
          In rate mode, this shows the percent of all admissions in the month
          that were reincarcerations.
        </li>
        <li>
          A location choice narrows down information to only reincarcerations of
          individuals who lived in that location prior to reincarceration.
        </li>
        <li>
          County of residence is determined by an individual&apos;s most recent
          home address. If the most recent address is that of a ND DOCR facility
          or parole and probation office, the last known non-incarcerated
          address is used.
        </li>
        <li>
          Just over 40% of people with known reincarcerations are not included
          in the map view or in selections by county of residence. For
          approximately 28% of people, this is because there is no known
          non-incarcerated address. For approximately 13% of people, this is
          because the last known non-incarcerated address is outside of North
          Dakota.
        </li>
        <li>
          Selecting a location while in rate mode calculates the percentage of
          prison admissions in a month from that location that were
          reincarcerations.
        </li>
      </ul>
    </div>
  ),
};

export default methodologies;
