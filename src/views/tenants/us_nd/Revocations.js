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
import { getPeriodLabelFromTimeWindowToggle } from '../../../utils/charts/toggles';

import AdmissionCountsByType
  from '../../../components/charts/revocations/AdmissionCountsByType';
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
import RevocationRateByCounty
  from '../../../components/charts/revocations/RevocationRateByCounty';
import RevocationsByOffice
  from '../../../components/charts/revocations/RevocationsByOffice';

import ToggleBar from '../../../components/toggles/ToggleBar';
import * as ToggleDefaults from '../../../components/toggles/ToggleDefaults';

const Revocations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [chartMetricType, setChartMetricType] = useState(ToggleDefaults.metricType);
  const [chartTimeWindow, setChartTimeWindow] = useState(ToggleDefaults.timeWindow);
  const [chartSupervisionType, setChartSupervisionType] = useState(ToggleDefaults.supervisionType);
  const [chartDistrict, setChartDistrict] = useState(ToggleDefaults.district);

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

  return (
    <main className="main-content bgc-grey-100">
      <div id="mainContent">

        <ToggleBar
          setChartMetricType={setChartMetricType}
          setChartTimeWindow={setChartTimeWindow}
          setChartSupervisionType={setChartSupervisionType}
          setChartDistrict={setChartDistrict}
          availableDistricts={['beulah', 'bismarck', 'bottineau', 'devils-lake', 'dickson', 'fargo', 'grafton', 'grand-forks', 'jamestown', 'mandan', 'minot', 'oakes', 'rolla', 'washburn', 'wahpeton', 'williston']}
        />

        <div className="row gap-20 pos-r">

          {/* #Revocation counts by month chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REVOCATIONS BY MONTH
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationCountsByMonth" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationCountsByMonth">
                          <a className="dropdown-item" id="downloadChartAsImage-revocationCountsByMonth" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-revocationCountsByMonth" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <div className="dynamic-chart-header" id="revocationCountsByMonth-header" />
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountOverTime
                    metricType={chartMetricType}
                    timeWindow={chartTimeWindow}
                    supervisionType={chartSupervisionType}
                    district={chartDistrict}
                    revocationCountsByMonth={apiData.revocations_by_month}
                    header="revocationCountsByMonth-header"
                  />
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
                          Revocation counts include the number of people who were incarcerated
                          in a DOCR facility because their supervision was revoked.
                        </li>
                        <li>
                          Revocations are included based on the date that the person
                          was admitted to a DOCR facility because their supervision
                          was revoked, not the date of the causal violation or offense.
                        </li>
                        <li>
                          Violations include all violations of supervision conditions
                          that resulted in revocation, which are new offenses,
                          technical violations, and absconsion.
                        </li>
                        <li>
                          Revocation rates are calculated as the number of people who were
                          incarcerated in a DOCR facility for a revocation during the time
                          period divided by the total number of people on probation or parole
                          at any point during the time period.
                        </li>
                        <li>
                          When a supervision type and/or parole office is selected, the
                          revocation rate is the number of people with revocations fitting
                          the selected criteria divided by the total number of people fitting
                          the selected criteria.
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

          {/* #Revocation rate by county chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REVOCATION RATE BY COUNTY OF RESIDENCE
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationRateByCounty" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationRateByCounty">
                          <a className="dropdown-item" id="downloadChartData-revocationRateByCounty" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <RevocationRateByCounty
                      metricType={chartMetricType}
                      timeWindow={chartTimeWindow}
                      revocationRateByCounty={apiData.revocation_rate_by_county_60_days}
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationRateByCounty">
                  <div className="mb-0" id="methodologyHeadingsRevocationRateByCounty">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationRateByCounty" aria-expanded="true" aria-controls="collapseMethodologyRevocationRateByCounty">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyRevocationRateByCounty" aria-labelledby="methodologyHeadingRevocationRateByCounty" data-parent="#methodologyRevocationRateByCounty">
                    <div>
                      <ul>
                        <li>
                          Revocation rates are calculated as the number of people who were
                          incarcerated in a DOCR facility for a revocation during the
                          time period over the total number of people on probation or parole
                          at any point during the time period.
                        </li>
                        <li>
                          The county of residence for a person is determined by their last
                          known address that is not a DOCR facility or a P&P office.
                        </li>
                        <li>
                          Revocations are included based on the date that the person
                          was admitted to a DOCR facility because their supervision
                          was revoked, not the date of the causal violation or offense.
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
                        {getPeriodLabelFromTimeWindowToggle(chartTimeWindow)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by P&P office chart ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REVOCATIONS BY P&P OFFICE
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationsByOffice" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationsByOffice">
                          <a className="dropdown-item" id="downloadChartData-revocationsByOffice" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-40 row">
                  <div className="layer w-100 p-20">
                    <RevocationsByOffice
                      metricType={chartMetricType}
                      timeWindow={chartTimeWindow}
                      supervisionType={chartSupervisionType}
                      revocationsByOffice={apiData.revocations_by_site_id_60_days}
                      officeData={apiData.site_offices}
                      officerDropdownId="district-toggle"
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationsByOffice">
                  <div className="mb-0" id="methodologyHeadingsRevocationsByOffice">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationsByOffice" aria-expanded="true" aria-controls="collapseMethodologyRevocationsByOffice">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyRevocationsByOffice" aria-labelledby="methodologyHeadingRevocationsByOffice" data-parent="#methodologyRevocationsByOffice">
                    <div>
                      <ul>
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          in a DOCR facility because their supervision was revoked.
                        </li>
                        <li>
                          Revocations are attributed to the site of the
                          terminating officer at the time of a person&apos;s revocation.
                        </li>
                        <li>
                          Revocations are included based on the date that the person
                          was admitted to a DOCR facility because their supervision
                          was revoked, not the date of the causal violation or offense.
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
                        {getPeriodLabelFromTimeWindowToggle(chartTimeWindow)}
                      </span>
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
                <div className="layer w-100 p-20">
                  <RevocationCountByOfficer
                    metricType={chartMetricType}
                    timeWindow={chartTimeWindow}
                    supervisionType={chartSupervisionType}
                    district={chartDistrict}
                    revocationCountsByOfficer={apiData.revocations_by_officer_60_days}
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
                        {getPeriodLabelFromTimeWindowToggle(chartTimeWindow)}
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
                      <span className="pL-10 c-orange-500 ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing all individuals on supervision. It doesn’t support showing only individuals on probation or only individuals on parole." />
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
                <div className="layer w-100 p-20">
                  <RevocationCountBySupervisionType
                    metricType={chartMetricType}
                    timeWindow={chartTimeWindow}
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
                          Revocations count people who were incarcerated in a DOCR facility
                          because their supervision was revocation.
                        </li>
                        <li>
                          Percentage shows the percent of revocations in a month associated
                          with individuals on parole and the percent associated with
                          individuals on probation.
                        </li>
                        <li>
                          Revocations are included based on the date that the person
                          was admitted to a DOCR facility because their supervision
                          was revoked, not the date of the causal violation or offense.
                        </li>
                        <li>
                          Violations include all violations of supervision conditions
                          that resulted in revocation, which are new offenses,
                          technical violations, and absconsion.
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
                <div className="layer w-100 p-20">
                  <RevocationCountByViolationType
                    metricType={chartMetricType}
                    timeWindow={chartTimeWindow}
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
                          Revocation counts include the number of people who were incarcerated
                          in a DOCR facility because their supervision was revoked.
                        </li>
                        <li>
                          Percentage is the percent of revocations in a given month caused by
                          each violation type.
                        </li>
                        <li>
                          Violations include all violations of supervision conditions
                          that resulted in revocation, which are new offenses,
                          technical violations, and absconsion.
                        </li>
                        <li>
                          Violations of "Unknown Type" indicate individuals who were admitted to
                          prison for a supervision revocation where the violation that caused the
                          revocation cannot yet be determined.
                        </li>
                        <li>
                          "Technical" revocations include only those revocations which result solely
                          from a technical violation. If there is a violation that includes a new
                          offense or an absconsion, it is considered a non-technical revocation.
                        </li>
                        <li>
                          Revocations are included based on the date that the person
                          was admitted to a DOCR facility because their supervision
                          was revoked, not the date of the causal violation or offense.
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
                    {chartSupervisionType !== 'all' && (
                      <span className="pL-10 c-orange-500 ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing all admission types regardless of supervision type. It doesn’t support showing only individuals on probation or only individuals on parole." />
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
                <div className="layer w-100 p-20">
                  <AdmissionCountsByType
                    metricType={chartMetricType}
                    timeWindow={chartTimeWindow}
                    district={chartDistrict}
                    admissionCountsByType={apiData.admissions_by_type_60_days}
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
                          New admissions include unique people admitted to any DOCR facility during
                          a particular time frame, regardless of whether they were previously
                          incarcerated.
                        </li>
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          in a DOCR facility because their supervision was revoked.
                        </li>
                        <li>
                          "Technical Revocations" include only those revocations which result solely
                          from a technical violation. If there is a violation that includes a new
                          offense or an absconsion, it is considered a "Non-Technical Revocation".
                        </li>
                        <li>
                          Revocations of "Unknown Type" indicate individuals who were admitted to
                          prison for a supervision revocation where the violation that caused the
                          revocation cannot yet be determined.
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
                        {getPeriodLabelFromTimeWindowToggle(chartTimeWindow)}
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
                  <div className="layer w-100 p-20">
                    <RevocationProportionByRace
                      metricType={chartMetricType}
                      timeWindow={chartTimeWindow}
                      supervisionType={chartSupervisionType}
                      district={chartDistrict}
                      revocationProportionByRace={
                        apiData.revocations_by_race_and_ethnicity_60_days}
                      supervisionPopulationByRace={
                        apiData.supervision_population_by_race_and_ethnicity_60_days}
                      statePopulationByRace={
                        apiData.race_proportions}
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
                          Revocation counts include the number of people who were incarcerated
                          in a DOCR facility because their supervision was revoked.
                        </li>
                        <li>
                          “Supervision Population” refers to individuals meeting the criteria
                          selected up top. At its most general, this is all individuals on
                          parole or Probation in North Dakota at any point during this time
                          period.
                        </li>
                        <li>
                          If a supervision type (parole or probation) is selected, revocation
                          and supervision population will only count individuals meeting that
                          criteria.
                        </li>
                        <li>
                          If a P&P office is selected, revocations and the supervision
                          population will only count individuals currently assigned, or with
                          a terminating officer at time of revocation, from that office.
                        </li>
                        <li>
                          The race proportions for the population of North Dakota were taken from
                          the U.S. Census Bureau.
                        </li>
                        <li>
                          If an individual has more than one race or ethnicity
                          recorded from different data systems, then they are
                          counted once for each unique race and ethnicity. This
                          means that the total count in this chart may be
                          larger than the total number of individuals it
                          describes. This does not apply to the ND Population
                          values.
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
                        {getPeriodLabelFromTimeWindowToggle(chartTimeWindow)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Revocations;
