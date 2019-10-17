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

import Loading from '../components/Loading';
import '../assets/styles/index.scss';
import { useAuth0 } from '../react-auth0-spa';
import { callMetricsApi, awaitingResults } from '../utils/metricsClient';

import RevocationCountOverTime from '../components/charts/revocations/RevocationCountOverTime';
import RevocationCountBySupervisionType from '../components/charts/revocations/RevocationCountBySupervisionType';
import RevocationCountByViolationType from '../components/charts/revocations/RevocationCountByViolationType';
import RevocationCountByOfficer from '../components/charts/revocations/RevocationCountByOfficer';
import AdmissionTypeProportions from '../components/charts/revocations/AdmissionTypeProportions';
import RevocationProportionByRace from '../components/charts/revocations/RevocationProportionByRace';
import RevocationsByCounty from '../components/charts/revocations/RevocationsByCounty';
import RevocationsByOffice from '../components/charts/revocations/RevocationsByOffice';

const Revocations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('revocations', getTokenSilently);
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
                  <h4 style={{ height: '20px' }} className="dynamic-chart-header" id="revocationCountsByMonth-header" />
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="col-md-12">
                    <div className="layer w-100 p-20">
                      <RevocationCountOverTime
                        revocationCountsByMonth={apiData.revocations_by_month}
                        header="revocationCountsByMonth-header"
                      />
                    </div>
                  </div>
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
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by county chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REVOCATIONS BY COUNTY
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationsByCounty" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationsByCounty">
                          <a className="dropdown-item" id="downloadChartData-revocationsByCounty" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <RevocationsByCounty
                      revocationsByCounty={apiData.revocations_by_county_60_days}
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationsByCounty">
                  <div className="mb-0" id="methodologyHeadingsRevocationsByCounty">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationsByCounty" aria-expanded="true" aria-controls="collapseMethodologyRevocationsByCounty">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyRevocationsByCounty" aria-labelledby="methodologyHeadingRevocationsByCounty" data-parent="#methodologyRevocationsByCounty">
                    <div>
                      <ul>
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          in a DOCR facility because their supervision was revoked.
                        </li>
                        <li>
                          Revocations are attributed to the county where the person&apos;s
                          supervision was terminated.
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
                        Last 60 days
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
                      revocationsByOffice={apiData.revocations_by_site_id_60_days}
                      officeData={apiData.site_offices}
                      officerDropdownId="showOfficersOfOffice"
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
                        Last 60 days
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
                <div className="layer p-20 w-100">
                  <span className="fa-pull-left">
                    <div className="dropdown show">
                      <a className="btn btn-secondary btn-sm dropdown-toggle" href="javascript:void(0);" role="button" id="showOfficersOfOffice" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        SITE NAME
                      </a>
                      <div className="dropdown-menu" aria-labelledby="showOfficersOfOffice" id="showOfficersOfOfficeMenu">
                        <a className="dropdown-item" id="showOfficersOfOffice-All-Officers" href="javascript:void(0);">All Officers</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Beulah" href="javascript:void(0);">Beulah</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Bismarck" href="javascript:void(0);">Bismarck</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Bottineau" href="javascript:void(0);">Bottineau</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Devils-Lake" href="javascript:void(0);">Devils Lake</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Dickinson" href="javascript:void(0);">Dickinson</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Fargo" href="javascript:void(0);">Fargo</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Grafton" href="javascript:void(0);">Grafton</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Grand-Forks" href="javascript:void(0);">Grand Forks</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Jamestown" href="javascript:void(0);">Jamestown</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Mandan" href="javascript:void(0);">Mandan</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Minot" href="javascript:void(0);">Minot</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Oakes" href="javascript:void(0);">Oakes</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Rolla" href="javascript:void(0);">Rolla</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Wahpeton" href="javascript:void(0);">Wahpeton</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Washburn" href="javascript:void(0);">Washburn</a>
                        <a className="dropdown-item" id="showOfficersOfOffice-Williston" href="javascript:void(0);">Williston</a>
                      </div>
                    </div>
                  </span>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountByOfficer
                    revocationCountsByOfficer={apiData.revocations_by_officer_60_days}
                    officeData={apiData.site_offices}
                    dropdownId="showOfficersOfOffice"
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
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Period </small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
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
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-admissionTypeProportions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-admissionTypeProportions">
                          <a className="dropdown-item" id="downloadChartAsImage-admissionTypeProportions" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-admissionTypeProportions" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 p-20">
                  <AdmissionTypeProportions
                    admissionCountsByType={apiData.admissions_by_type_60_days}
                  />
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyAdmissionTypeProportions">
                  <div className="mb-0" id="methodologyHeadingAdmissionTypeProportions">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyAdmissionTypeProportions" aria-expanded="true" aria-controls="collapseMethodologyAdmissionTypeProportions">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyAdmissionTypeProportions" className="collapse" aria-labelledby="methodologyHeadingRevocationByOfficer" data-parent="#methodologyAdmissionTypeProportions">
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
                        Last 60 days
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
                          The supervision population counts people on probation or parole in North
                          Dakota at any point during the time period.
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
                        Last 60 days
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
