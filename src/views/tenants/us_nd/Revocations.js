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

import React, { useState, useEffect } from 'react';
import * as $ from 'jquery';

import Loading from '../../../components/Loading';
import '../../../assets/styles/index.scss';
import { useAuth0 } from '../../../react-auth0-spa';
import { callMetricsApi, awaitingResults } from '../../../utils/metricsClient';
import { getPeriodLabelFromMetricPeriodMonthsToggle } from '../../../utils/charts/toggles';

import AdmissionCountsByType
  from '../../../components/charts/revocations/AdmissionCountsByType';
import CaseTerminationsByTerminationType
  from '../../../components/charts/revocations/CaseTerminationsByTerminationType';
import CaseTerminationsByOfficer
  from '../../../components/charts/revocations/CaseTerminationsByOfficer';
import RevocationCountByOfficer
  from '../../../components/charts/revocations/RevocationCountByOfficer';
import RevocationCountBySupervisionType
  from '../../../components/charts/revocations/RevocationCountBySupervisionType';
import RevocationCountByViolationType
  from '../../../components/charts/revocations/RevocationCountByViolationType';
import RevocationCountOverTime
  from '../../../components/charts/revocations/RevocationCountOverTime';
import RevocationProportionByRace
  from '../../../components/charts/revocations/RevocationProportionByRace';
import GeoViewTimeChart from '../../../components/charts/GeoViewTimeChart';

import GeoViewToggle from '../../../components/toggles/GeoViewToggle';
import ToggleBar from '../../../components/toggles/ToggleBar';
import * as ToggleDefaults from '../../../components/toggles/ToggleDefaults';
import PageTemplate from './PageTemplate';

const Revocations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [chartMetricType, setChartMetricType] = useState(ToggleDefaults.metricType);
  const [chartMetricPeriodMonths, setChartMetricPeriodMonths] = useState(ToggleDefaults.metricPeriodMonths);
  const [chartSupervisionType, setChartSupervisionType] = useState(ToggleDefaults.supervisionType);
  const [chartDistrict, setChartDistrict] = useState(ToggleDefaults.district);
  const [geoViewEnabledRCOT, setGeoViewEnabledRCOT] = useState(ToggleDefaults.geoView);

  const importantNotes = [
    {
      header: 'PERSON-BASED COUNTING',
      body: `Unless noted otherwise, counts in this dashboard are based on people: the number of
      people admitted to prison because of a revocation, the number of people an officer was
      supervising who had a revocation resulting in a return to prison, and so on.`,
    },
    {
      header: 'REVOCATIONS TO DOCR FACILITY',
      body: `Unless noted otherwise, "revocation" refers only to revocations resulting in
      incarceration at a DOCR facility. Revocations resulting in continuation of supervision, a
      county jail sentence, or termination of supervision are not considered. In addition,
      revocations are counted only when an individual’s admittance to a facility is documented in
      Elite as a revocation. Individuals who have their supervision terminated due to revocation
      (resulting in incarceration) but are admitted back into the system with the code
      "new admission" are not included in revocation counts.

      However, in case termination charts, all cases terminated via revocation as noted in Docstars
      are included whether or not they result in incarceration.`,
    },
    {
      header: 'DATA PULLED FROM ELITE & DOCSTARS',
      body: `Data in the dashboard is updated nightly using information pulled from Elite and
      Docstars.`,
    },
    {
      header: 'LEARN MORE',
      body: 'Click on "Methodology" for more information on the calculations behind that chart.',
    },
  ];

  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });

  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('us_nd/revocations', getTokenSilently);
      setApiData(responseData);
      setAwaitingApi(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  const toggleBar = (
    <ToggleBar
      setChartMetricType={setChartMetricType}
      setChartMetricPeriodMonths={setChartMetricPeriodMonths}
      setChartSupervisionType={setChartSupervisionType}
      setChartDistrict={setChartDistrict}
      districtOffices={apiData.site_offices}
      availableDistricts={['beulah', 'bismarck', 'bottineau', 'devils-lake', 'dickson', 'fargo', 'grafton', 'grand-forks', 'jamestown', 'mandan', 'minot', 'oakes', 'rolla', 'washburn', 'wahpeton', 'williston']}
    />
  );

  return (
    <PageTemplate
      toggleBar={toggleBar}
      importantNotes={importantNotes}
    >
      <>
        {/* #Revocation counts by month chart ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  REVOCATIONS BY MONTH
                  <span className="fa-pull-right">
                    <div className="geo-view-button pR-10">
                      <GeoViewToggle setGeoViewEnabled={setGeoViewEnabledRCOT} />
                    </div>
                    <div className="dropdown show export-button">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationCountsByMonth" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationCountsByMonth">
                        {geoViewEnabledRCOT === false && (
                          <a className="dropdown-item" id="downloadChartAsImage-revocationCountsByMonth" href="javascript:void(0);">Export image</a>
                        )}
                        <a className="dropdown-item" id="downloadChartData-revocationCountsByMonth" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 pX-20 pT-20">
                {geoViewEnabledRCOT === false && (
                  <div className="dynamic-chart-header" id="revocationCountsByMonth-header" />
                )}
              </div>
              { /* TODO(XXX): Figure out why map will not show when delegated to by the Chart.js
              chart. Then we can just encapsulate this logic inside of a single component. */ }
              <div className="layer w-100 p-20 fs-block">
                {geoViewEnabledRCOT === false && (
                  <RevocationCountOverTime
                    metricType={chartMetricType}
                    metricPeriodMonths={chartMetricPeriodMonths}
                    supervisionType={chartSupervisionType}
                    district={chartDistrict}
                    geoView={geoViewEnabledRCOT}
                    officeData={apiData.site_offices}
                    revocationCountsByMonth={apiData.revocations_by_month}
                    header="revocationCountsByMonth-header"
                  />
                )}
                {geoViewEnabledRCOT === true && (
                  <GeoViewTimeChart
                    chartId="revocationCountsByMonth"
                    chartTitle="REVOCATIONS BY MONTH"
                    metricType={chartMetricType}
                    metricPeriodMonths={chartMetricPeriodMonths}
                    supervisionType={chartSupervisionType}
                    keyedByOffice={true}
                    officeData={apiData.site_offices}
                    dataPointsByOffice={apiData.revocations_by_period}
                    numeratorKeys={['revocation_count']}
                    denominatorKeys={['total_supervision_count']}
                    centerLat={47.3}
                    centerLong={-100.5}
                  />
                )}
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationCountsByMonth">
                <div className="mb-0" id="methodologyHeadingRevocationCountsByMonth">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationCountsByMonth" aria-expanded="true" aria-controls="collapseMethodologyRevocationCountsByMonth">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div id="collapseMethodologyRevocationCountsByMonth" className="collapse" aria-labelledby="methodologyHeadingRevocationCountsByMonth" data-parent="#methodologyRevocationCountsByMonth">
                  <div>
                    <ul>
                      <li>
                        Revocations are included based on when the person was admitted to a DOCR
                        facility, not when the violation, offense, or revocation occurred.
                      </li>
                      <li>
                        When &quot;rate&quot; is selected, the chart shows the percent of the total
                        supervised population incarcerated due to supervision revocation. For the
                        percent of cases closed via revocation, see the
                        &quot;Case terminations by month&quot; chart.
                      </li>
                      <li>
                        When a supervision type and/or office is selected, the rate is the number of
                        people with revocations who match the selected filters divided by the total
                        number of people on supervision who also match the selected filters.
                      </li>
                      <li>
                        Revocations are considered probation revocations or parole revocations based
                        on the DOCR admission reason. Because only one reason can be selected, an
                        individual&apos;s revocation will count only towards EITHER parole or
                        probation even if they were on both parole and probation prior to
                        incarceration.
                      </li>
                      <li>
                        Revocations are attributed to the site of the terminating officer on the
                        revocation in Docstars. Revocation admissions that can&apos;t be matched to
                        a supervision case are not attributed to an office.
                      </li>
                      <li>
                        Revocations are attributed to the site of the
                        terminating officer at the time of a person&apos;s revocation.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Revocations by officer id ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  REVOCATIONS BY OFFICER
                  {chartDistrict === 'all' && (
                    <span className="pL-10 toggle-alert ti-alert" data-toggle="tooltip" data-placement="bottom" title="Exporting this chart as an image will not include officer IDs unless a specific P&P office is selected from the Explore bar." />
                  )}
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationsByOfficer" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationsByOfficer">
                        <a className="dropdown-item" id="downloadChartAsImage-revocationsByOfficer" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-revocationsByOfficer" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 p-20 fs-block">
                <RevocationCountByOfficer
                  metricType={chartMetricType}
                  metricPeriodMonths={chartMetricPeriodMonths}
                  supervisionType={chartSupervisionType}
                  district={chartDistrict}
                  revocationCountsByOfficer={apiData.revocations_by_officer_by_period}
                  officeData={apiData.site_offices}
                />
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationByOfficer">
                <div className="mb-0" id="methodologyHeadingRevocationByOfficer">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationByOfficer" aria-expanded="true" aria-controls="collapseMethodologyRevocationByOfficer">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div id="collapseMethodologyRevocationByOfficer" className="collapse" aria-labelledby="methodologyHeadingRevocationByOfficer" data-parent="#methodologyRevocationByOfficer">
                  <div>
                    <ul>
                      <li>
                        Revocations are counted towards an officer if that officer is flagged as
                        the terminating officer at the time of a person&apos;s revocation.
                      </li>
                      <li>
                        When an individual has multiple violation types leading to revocation, we
                        display only the most severe violation. New offenses are considered more
                        severe than absconsions, which are considered more severe than technicals.
                      </li>
                      <li>
                        Revocations are included based on the date that the person
                        was admitted to a DOCR facility because their supervision
                        was revoked, not the date of the causal violation or offense.
                      </li>
                      <li>
                        The revocation rate refers to the percent of an officer’s total
                        revocation count caused by each violation type.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="layer bdT p-20 w-100">
                <div className="peers ai-c jc-c gapX-20">
                  <div className="peer fw-600">
                    <small className="c-grey-500 fw-600">Period </small>
                    <span className="fsz-def fw-600 mR-10 c-grey-800">
                      {getPeriodLabelFromMetricPeriodMonthsToggle(chartMetricPeriodMonths)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Revocations by supervision type ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  REVOCATIONS BY SUPERVISION TYPE
                  {chartSupervisionType !== 'all' && (
                    <span className="pL-10 toggle-alert ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing all individuals on supervision. It doesn’t support showing only individuals on probation or only individuals on parole." />
                  )}
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationsBySupervisionType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationsBySupervisionType">
                        <a className="dropdown-item" id="downloadChartAsImage-revocationsBySupervisionType" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-revocationsBySupervisionType" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 p-20 fs-block">
                <RevocationCountBySupervisionType
                  metricType={chartMetricType}
                  metricPeriodMonths={chartMetricPeriodMonths}
                  district={chartDistrict}
                  revocationCountsByMonthBySupervisionType={
                  apiData.revocations_by_supervision_type_by_month}
                />
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationsBySupervisionType">
                <div className="mb-0" id="methodologyHeadingRevocationsBySupervisiontype">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationsBySupervisionType" aria-expanded="true" aria-controls="collapseMethodologyRevocationsBySupervisionType">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div className="collapse" id="collapseMethodologyRevocationsBySupervisionType" aria-labelledby="methodologyHeadingRevocationsBySupervisiontype" data-parent="#methodologyRevocationsBySupervisionType">
                  <div>
                    <ul>
                      <li>
                        Percentage shows the percent of revocations in a month associated with
                        individuals on parole versus the percent associated with individuals on
                        probation.
                      </li>
                      <li>
                        Revocations are included based on the date that the person was admitted to a
                        DOCR facility because their supervision was revoked, not the date of the
                        causal violation or offense.
                      </li>
                      <li>
                        Revocations are considered probation revocations or parole revocations based
                        on the DOCR admission reason. Because only one reason can be selected, an
                        individual&apos;s revocation will count only towards EITHER parole or
                        probation even if they were on both parole and probation prior to
                        incarceration.
                      </li>
                      <li>
                        Filtering by office counts revocation admissions linked to supervision
                        revocations where the terminating officer is in the selected office.
                        Revocation admissions that can&apos;t be matched to a supervision case are
                        not attributed to an office.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Revocations by violation type ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  REVOCATIONS BY VIOLATION TYPE
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationsByViolationType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationsByViolationType">
                        <a className="dropdown-item" id="downloadChartAsImage-revocationsByViolationType" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-revocationsByViolationType" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 p-20 fs-block">
                <RevocationCountByViolationType
                  metricType={chartMetricType}
                  metricPeriodMonths={chartMetricPeriodMonths}
                  supervisionType={chartSupervisionType}
                  district={chartDistrict}
                  revocationCountsByMonthByViolationType={
                  apiData.revocations_by_violation_type_by_month}
                />
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationsByViolationType">
                <div className="mb-0" id="methodologyHeadingRevocationsByViolationType">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationsByViolationType" aria-expanded="true" aria-controls="collapseMethodologyRevocationsByViolationType">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div className="collapse" id="collapseMethodologyRevocationsByViolationType" aria-labelledby="methodologyHeadingRevocationsByViolationType" data-parent="#methodologyRevocationsByViolationType">
                  <div>
                    <ul>
                      <li>
                        Revocations are included based on the date that the person was admitted to
                        a DOCR facility because their supervision was revoked, not the date of the
                        supervision case closure or causal violation or offense.
                      </li>
                      <li>
                        Revocation counts include the number of people who were incarcerated in a
                        DOCR facility because their supervision was revoked.
                      </li>
                      <li>
                        Percentage is the percent of revocations in a given month caused by each
                        violation type.
                      </li>
                      <li>
                        When an individual has multiple violation types leading to revocation, we
                        display only the most severe violation. New offenses are considered more
                        severe than absconsions, which are considered more severe than technicals.
                      </li>
                      <li>
                        Violations of &quot;Unknown Type&quot; indicate individuals who were
                        admitted to prison for a supervision revocation where the violation that
                        caused the revocation cannot yet be determined. Revocation admissions are
                        linked to supervision cases closed via revocation within 90 days of the
                        admission. Revocation admissions without a supervision case closed via
                        revocation in this window will always be considered of
                        &quot;Unknown Type.&quot;
                      </li>
                      <li>
                        Revocations are attributed to the site of the terminating officer on the
                        revocation in Docstars. Revocation admissions that can&apos;t be matched to
                        a supervision case are not attributed to an office.
                      </li>
                      <li>
                        Revocations are considered probation revocations or parole revocations based
                        on the DOCR admission reason. Because only one reason can be selected, an
                        individual&apos;s revocation will count only towards EITHER parole or
                        probation even if they were on both parole and probation prior to
                        incarceration.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Case terminations by termination type ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  CASE TERMINATIONS BY TERMINATION TYPE
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-caseTerminationsByTerminationType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-caseTerminationsByTerminationType">
                        <a className="dropdown-item" id="downloadChartAsImage-caseTerminationsByTerminationType" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-caseTerminationsByTerminationType" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 p-20 fs-block">
                <CaseTerminationsByTerminationType
                  metricType={chartMetricType}
                  metricPeriodMonths={chartMetricPeriodMonths}
                  supervisionType={chartSupervisionType}
                  district={chartDistrict}
                  caseTerminationCountsByMonthByTerminationType={apiData.case_terminations_by_type_by_month}
                />
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyCaseTerminationsByTerminationType">
                <div className="mb-0" id="methodologyHeadingCaseTerminationsByTerminationType">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyCaseTerminationsByTerminationType" aria-expanded="true" aria-controls="collapseMethodologyCaseTerminationsByTerminationType">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div className="collapse" id="collapseMethodologyCaseTerminationsByTerminationType" aria-labelledby="methodologyHeadingCaseTerminationsByTerminationType" data-parent="#methodologyCaseTerminationsByTerminationType">
                  <div>
                    <ul>
                      <li>
                        This chart includes counts based on case, not person. If a person on supervision has multiple
                        cases, each case termination will be counted in the chart.
                      </li>
                      <li>
                        Case terminations are included based on termination date in Docstars.
                      </li>
                      <li>
                        Revocations are included based on a termination type of revocation in Docstars. Unlike other
                        revocation counts, this chart <span className="font-weight-bold">does not</span> only examine
                        revocations resulting in admission to a DOCR facility.
                      </li>
                      <li>
                        Absconsion is all cases terminated with termination code 13. Revocation is all cases
                        terminated with code 9 or 10. Suspension is cases terminated with code 3 or 6. Discharge is
                        cases terminated with code 1, 2, 5, 8, 12, 15, 16, 17, or 18. Expiration is cases terminated
                        with code 4, 7, 19, or 20. Death is cases terminated with code 11. Other is cases terminated
                        with code 14.
                      </li>
                      <li>
                        Case terminations are attributed to the P&P office of the terminating officer in Docstars.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Case terminations by officer ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  CASE TERMINATIONS BY OFFICER
                  {chartDistrict === 'all' && (
                    <span className="pL-10 toggle-alert ti-alert" data-toggle="tooltip" data-placement="bottom" title="Exporting this chart as an image will not include officer IDs unless a specific P&P office is selected from the Explore bar." />
                  )}
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-caseTerminationsByOfficer" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-caseTerminationsByOfficer">
                        <a className="dropdown-item" id="downloadChartAsImage-caseTerminationsByOfficer" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-caseTerminationsByOfficer" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 p-20 fs-block">
                <CaseTerminationsByOfficer
                  metricType={chartMetricType}
                  metricPeriodMonths={chartMetricPeriodMonths}
                  supervisionType={chartSupervisionType}
                  district={chartDistrict}
                  terminationCountsByOfficer={apiData.case_terminations_by_type_by_officer_by_period}
                  officeData={apiData.site_offices}
                />
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyCaseTerminationsByOfficer">
                <div className="mb-0" id="methodologyHeadingCaseTerminationsByOfficer">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyCaseTerminationsByOfficer" aria-expanded="true" aria-controls="collapseMethodologyCaseTerminationsByOfficer">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div className="collapse" id="collapseMethodologyCaseTerminationsByOfficer" aria-labelledby="methodologyHeadingCaseTerminationsByOfficer" data-parent="#methodologyCaseTerminationsByOfficer">
                  <div>
                    <ul>
                      <li>
                        This chart includes counts based on case, not person. If a person on supervision has multiple
                        cases, each case termination will be counted in the chart.
                      </li>
                      <li>
                        Case terminations are included based on termination date in Docstars.
                      </li>
                      <li>
                        Revocations are included based on a termination type of revocation in Docstars. Unlike other
                        revocation counts, this chart <span className="font-weight-bold">does not</span> only examine
                        revocations resulting in admission to a DOCR facility.
                      </li>
                      <li>
                        Absconsion is all cases terminated with termination code 13. Revocation is all cases terminated
                        with code 9 or 10. Suspension is cases terminated with code 3 or 6. Discharge is cases
                        terminated with code 1, 2, 5, 8, 12, 15, 16, 17, or 18. Expiration is cases terminated with code
                        4, 7, 19, or 20. Death is cases terminated with code 11. Other is cases terminated with code 14.
                      </li>
                      <li>
                        Case terminations are attributed to the terminating officer in Docstars.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Admission type proportions ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  ADMISSIONS BY TYPE
                  {((chartSupervisionType !== 'all' || chartDistrict !== 'all') && chartMetricType === 'rates') && (
                    <span className="pL-10 toggle-alert ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing both non-revocation admissions to prison and admissions due to revocation from both parole and probation. We cannot show percentages of admissions broken down by supervision type or district because non-revocation admissions to prison cannot be broken down along those dimensions." />
                  )}
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-admissionCountsByType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-admissionCountsByType">
                        <a className="dropdown-item" id="downloadChartAsImage-admissionCountsByType" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-admissionCountsByType" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 p-20 fs-block">
                <AdmissionCountsByType
                  metricType={chartMetricType}
                  supervisionType={chartSupervisionType}
                  metricPeriodMonths={chartMetricPeriodMonths}
                  district={chartDistrict}
                  admissionCountsByType={apiData.admissions_by_type_by_period}
                />
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyAdmissionCountsByType">
                <div className="mb-0" id="methodologyHeadingAdmissionCountsByType">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyAdmissionCountsByType" aria-expanded="true" aria-controls="collapseMethodologyAdmissionCountsByType">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div id="collapseMethodologyAdmissionCountsByType" className="collapse" aria-labelledby="methodologyHeadingRevocationByOfficer" data-parent="#methodologyAdmissionCountsByType">
                  <div>
                    <ul>
                      <li>
                        Admissions include people admitted to DOCR facilities during a particular
                        time frame, regardless of whether they were previously incarcerated.
                        Transfers, periods of temporary custody, returns from escape and/or
                        erroneous releases are not considered admissions.
                      </li>
                      <li>
                        Prison admissions are categorized as probation revocations, parole
                        revocations, or new admissions. New admissions are admissions resulting from
                        a reason other than revocation.
                      </li>
                      <li>
                        &quot;Technical Revocations&quot; include only those revocations which
                        result solely from a technical violation. If there is a violation that
                        includes a new offense or an absconsion, it is considered a
                        &quot;Non-Technical Revocation&quot;.
                      </li>
                      <li>
                        Revocations of &quot;Unknown Type&quot; indicate individuals who were
                        admitted to prison for a supervision revocation where the violation that
                        caused the revocation cannot yet be determined. Revocation admissions are
                        linked to supervision cases closed via revocation within 90 days of the
                        admission. Revocation admissions without a supervision case closed via
                        revocation in this window will always be considered of
                        &quot;Unknown Type.&quot;
                      </li>
                      <li>
                        Filtering the chart by supervision type and/or P&P office impacts only the
                        revocation admission counts. New admissions include individuals not
                        previously on supervision and thus cannot be filtered by office or
                        supervision type.
                      </li>
                      <li>
                        Revocations are attributed to the site of the terminating officer on the
                        revocation in Docstars. Revocation admissions that can&apos;t be matched to
                        a supervision case are not attributed to an office.
                      </li>
                      <li>
                        Revocations are considered either probation revocations or parole
                        revocations based on the DOCR admission reason; a revocation cannot be
                        categorized as both.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="layer bdT p-20 w-100">
                <div className="peers ai-c jc-c gapX-20">
                  <div className="peer fw-600">
                    <span className="fsz-def fw-600 mR-10 c-grey-800">
                      <small className="c-grey-500 fw-600">Period </small>
                      {getPeriodLabelFromMetricPeriodMonthsToggle(chartMetricPeriodMonths)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #Revocations by race chart ==================== */}
        <div className="col-md-6">
          <div className="bd bgc-white p-20">
            <div className="layers">
              <div className="layer w-100 pX-20 pT-20">
                <h6 className="lh-1">
                  REVOCATIONS BY RACE
                  <span className="fa-pull-right">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationsByRace" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Export
                      </a>
                      <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationsByRace">
                        <a className="dropdown-item" id="downloadChartAsImage-revocationsByRace" href="javascript:void(0);">Export image</a>
                        <a className="dropdown-item" id="downloadChartData-revocationsByRace" href="javascript:void(0);">Export data</a>
                      </div>
                    </div>
                  </span>
                </h6>
              </div>
              <div className="layer w-100 pX-20 pT-20 row">
                <div className="layer w-100 p-20 fs-block">
                  <RevocationProportionByRace
                    metricType={chartMetricType}
                    metricPeriodMonths={chartMetricPeriodMonths}
                    supervisionType={chartSupervisionType}
                    district={chartDistrict}
                    revocationProportionByRace={
                      apiData.revocations_by_race_and_ethnicity_by_period}
                    statePopulationByRace={apiData.race_proportions}
                  />
                </div>
              </div>
              <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationsByRace">
                <div className="mb-0" id="methodologyHeadingsRevocationsByRace">
                  <div className="mb-0">
                    <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationsByRace" aria-expanded="true" aria-controls="collapseMethodologyRevocationsByRace">
                      <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                    </button>
                  </div>
                </div>
                <div className="collapse" id="collapseMethodologyRevocationsByRace" aria-labelledby="methodologyHeadingRevocationsByRace" data-parent="#methodologyRevocationsByRace">
                  <div>
                    <ul>
                      <li>
                        The &quot;Supervision Population&quot; refers to individuals meeting the
                        criteria selected up top. At its most general, this is all individuals on
                        parole or probation in North Dakota at any point during this time period.
                      </li>
                      <li>
                        Revocation counts include the number of people who were incarcerated in a
                        DOCR facility because their supervision was revoked.
                      </li>
                      <li>
                        If a supervision type (parole or probation) is selected, the revocation and
                        supervision populations will only count individuals meeting that criteria.
                        Revocations are classified as either a parole revocation or a probation
                        revocation based on the admission reason. Individuals can, however, appear
                        in both the parole supervision population and the probation supervision
                        population if they have both parole & probation active supervision cases.
                      </li>
                      <li>
                        If a P&P office is selected, the supervision population and the revocation
                        count will only include individuals currently assigned to or terminated by
                        an officer from that office.
                      </li>
                      <li>
                        Source of race proportions in ND: US Census Bureau.
                      </li>
                      <li>
                        If an individual has more than one race or ethnicity recorded from different
                        data systems, they are counted once for each unique race and ethnicity.
                        This means that the total count in this chart may be larger than the total
                        number of individuals it describes.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="layer bdT p-20 w-100">
                <div className="peers ai-c jc-c gapX-20">
                  <div className="peer fw-600">
                    <span className="fsz-def fw-600 mR-10 c-grey-800">
                      <small className="c-grey-500 fw-600">Period </small>
                      {getPeriodLabelFromMetricPeriodMonthsToggle(chartMetricPeriodMonths)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </PageTemplate>
  );
};

export default Revocations;
