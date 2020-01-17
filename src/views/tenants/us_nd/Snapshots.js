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

import DaysAtLibertySnapshot from '../../../components/charts/snapshots/DaysAtLibertySnapshot';
import LsirScoreChangeSnapshot from '../../../components/charts/snapshots/LsirScoreChangeSnapshot';
import RevocationAdmissionsSnapshot
  from '../../../components/charts/snapshots/RevocationAdmissionsSnapshot';
import SupervisionSuccessSnapshot
  from '../../../components/charts/snapshots/SupervisionSuccessSnapshot';
import GeoViewTimeChart from '../../../components/charts/GeoViewTimeChart';

import GeoViewToggle from '../../../components/toggles/GeoViewToggle';
import ToggleBar from '../../../components/toggles/ToggleBar';
import * as ToggleDefaults from '../../../components/toggles/ToggleDefaults';

const Snapshots = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [chartMetricType, setChartMetricType] = useState(ToggleDefaults.metricType);
  const [chartTimeWindow, setChartTimeWindow] = useState(ToggleDefaults.timeWindow);
  const [chartSupervisionType, setChartSupervisionType] = useState(ToggleDefaults.supervisionType);
  const [chartDistrict, setChartDistrict] = useState(ToggleDefaults.district);
  const [geoViewEnabledSCOS, setGeoViewEnabledSCOS] = useState(ToggleDefaults.geoView);
  const [geoViewEnabledPDTR, setGeoViewEnabledPDTR] = useState(ToggleDefaults.geoView);
  const [geoViewEnabledALSI, setGeoViewEnabledALSI] = useState(ToggleDefaults.geoView);

  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });

  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('us_nd/snapshots', getTokenSilently);
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

          {/* #Successful completion of supervision snapshot ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    SUCCESSFUL COMPLETION OF SUPERVISION
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-supervisionSuccessSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-supervisionSuccesSnapshot">
                          {geoViewEnabledSCOS === false && (
                            <a className="dropdown-item" id="downloadChartAsImage-supervisionSuccessSnapshot" href="javascript:void(0);">Export image</a>
                          )}
                          <a className="dropdown-item" id="downloadChartData-supervisionSuccessSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-10">
                  <GeoViewToggle setGeoViewEnabled={setGeoViewEnabledSCOS} />
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  {geoViewEnabledSCOS === false && (
                    <div className="dynamic-chart-header" id="supervisionSuccessSnapshot-header" />
                  )}
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      { /* TODO(XXX): Figure out why map will not show when delegated to by the Chart.js
                      chart. Then we can just encapsulate this logic inside of a single component. */ }
                      {geoViewEnabledSCOS === false && (
                        <SupervisionSuccessSnapshot
                          metricType={chartMetricType}
                          timeWindow={chartTimeWindow}
                          supervisionType={chartSupervisionType}
                          district={chartDistrict}
                          supervisionSuccessRates={apiData.supervision_termination_by_type_by_month}
                          header="supervisionSuccessSnapshot-header"
                        />
                      )}
                      {geoViewEnabledSCOS === true && (
                        <GeoViewTimeChart
                          chartId="supervisionSuccessSnapshot"
                          chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
                          metricType={chartMetricType}
                          timeWindow={chartTimeWindow}
                          supervisionType={chartSupervisionType}
                          keyedByOffice={true}
                          officeData={apiData.site_offices}
                          dataPointsByOffice={apiData.supervision_termination_by_type_over_time_window}
                          numeratorKeys={['revocation_termination']}
                          denominatorKeys={['revocation_termination', 'successful_termination']}
                          centerLat={47.3}
                          centerLong={-100.5}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologySupervisionSuccessSnapshot">
                  <div className="mb-0" id="methodologyHeadingSupervisionSuccessSnapshot">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologySupervisionSuccessSnapshot" aria-expanded="true" aria-controls="collapseMethodologySupervisionSuccessSnapshot">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologySupervisionSuccessSnapshot" aria-labelledby="methodologyHeadingSupervisionSuccessSnapshot" data-parent="#methodologySupervisionSuccessSnapshot">
                    <div>
                      <ul>
                        <li>
                        A supervision is considered successfully completed
                        if the individual was discharged from supervision positively
                        or if their supervision period expired.
                        </li>
                        <li>
                        Unsuccessful completions of supervision occur when the
                        supervision ends due to absconsion, a revocation, or a
                        negative termination.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Prison admissions from revocations ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    PRISON ADMISSIONS DUE TO REVOCATION
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationAdmissionsSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationAdmissionsSnapshot">
                          {geoViewEnabledPDTR === false && (
                            <a className="dropdown-item" id="downloadChartAsImage-revocationAdmissionsSnapshot" href="javascript:void(0);">Export image</a>
                          )}
                          <a className="dropdown-item" id="downloadChartData-revocationAdmissionsSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-10">
                  <GeoViewToggle setGeoViewEnabled={setGeoViewEnabledPDTR} />
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  {geoViewEnabledPDTR === false && (
                    <div className="dynamic-chart-header" id="revocationAdmissionsSnapshot-header" />
                  )}
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      {geoViewEnabledPDTR === false && (
                        <RevocationAdmissionsSnapshot
                          metricType={chartMetricType}
                          timeWindow={chartTimeWindow}
                          supervisionType={chartSupervisionType}
                          district={chartDistrict}
                          revocationAdmissionsByMonth={apiData.admissions_by_type_by_month}
                          header="revocationAdmissionsSnapshot-header"
                        />
                      )}
                      {geoViewEnabledPDTR === true && (
                        <GeoViewTimeChart
                          chartId="revocationAdmissionsSnapshot"
                          chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
                          metricType={chartMetricType}
                          timeWindow={chartTimeWindow}
                          supervisionType={chartSupervisionType}
                          keyedByOffice
                          shareDenominatorAcrossRates
                          officeData={apiData.site_offices}
                          dataPointsByOffice={apiData.admissions_by_type_over_time_window}
                          numeratorKeys={['technicals', 'non_technicals', 'unknown_revocations']}
                          denominatorKeys={['technicals', 'non_technicals', 'unknown_revocations', 'new_admissions']}
                          centerLat={47.3}
                          centerLong={-100.5}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationAdmissionsSnapshot">
                  <div className="mb-0" id="methodologyHeadingRevocationAdmissionsSnapshot">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationAdmissionsSnapshot" aria-expanded="true" aria-controls="collapseMethodologyRevocationAdmissionsSnapshot">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyRevocationAdmissionsSnapshot" aria-labelledby="methodologyHeadingRevocationAdmissionsSnapshot" data-parent="#methodologyRevocationAdmissionsSnapshot">
                    <div>
                      <ul>
                        <li>
                          This is a measurement of the percent of admissions to
                          North Dakota prisons that were due to revocations of supervision.
                        </li>
                        <li>
                          Revocations in a given month count people who were incarcerated
                          in that month because their supervision was revoked.
                        </li>
                        <li>
                          When a specific district and/or supervision type is selected, the rate
                          metric is defined as the number of revocation admissions from that
                          district and/or supervision type divided by the total number of admissions
                          across all districts and supervision types within the same time period.
                          Simply put, it is equal to the percentage of total admisssions caused by
                          revocations matching the given filters.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Average days at liberty ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    DAYS AT LIBERTY (AVERAGE)
                    {(chartMetricType !== 'counts' || chartSupervisionType !== 'all') && (
                      <span className="pL-10 c-orange-500 ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing average days at liberty. It does not support showing this metric as a rate. It also doesn’t support showing only individuals on probation or only individuals on parole as it is not supervision-focused." />
                    )}
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-daysAtLibertySnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-daysAtLibertySnapshot">
                          <a className="dropdown-item" id="downloadChartAsImage-daysAtLibertySnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-daysAtLibertySnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <div className="dynamic-chart-header" id="daysAtLibertySnapshot-header" />
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <DaysAtLibertySnapshot
                        timeWindow={chartTimeWindow}
                        district={chartDistrict}
                        daysAtLibertyByMonth={apiData.avg_days_at_liberty_by_month}
                        header="daysAtLibertySnapshot-header"
                      />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyDaysAtLibertySnapshot">
                  <div className="mb-0" id="methodologyHeadingDaysAtLibertySnapshot">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyDaysAtLibertySnapshot" aria-expanded="true" aria-controls="collapseMethodologyDaysAtLibertySnapshot">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyDaysAtLibertySnapshot" aria-labelledby="methodologyHeadingDaysAtLibertySnapshot" data-parent="#methodologyDaysAtLibertySnapshot">
                    <div>
                      <ul>
                        <li>
                        An individual&apos;s days at liberty are the number of
                        days between release from incarceration and readmission
                        for someone who was reincarcerated in a given month.
                        </li>
                        <li>
                        An admission to prison counts as a reincarceration if
                        the person has been incarcerated previously in a North
                        Dakota prison.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Change in LSI-R scores ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    LSI-R SCORE CHANGES (AVERAGE)
                    {chartMetricType !== 'counts' && (
                      <span className="pL-10 c-orange-500 ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing average LSI-R score change. It does not support showing this metric as a rate." />
                    )}
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-lsirScoreChangeSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-lsirScoreChangeSnapshot">
                          {geoViewEnabledALSI === false && (
                            <a className="dropdown-item" id="downloadChartAsImage-lsirScoreChangeSnapshot" href="javascript:void(0);">Export image</a>
                          )}
                          <a className="dropdown-item" id="downloadChartData-lsirScoreChangeSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-10">
                  <GeoViewToggle setGeoViewEnabled={setGeoViewEnabledALSI} />
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  {geoViewEnabledALSI === false && (
                    <div className="dynamic-chart-header" id="lsirScoreChangeSnapshot-header" />
                  )}
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      {geoViewEnabledALSI === false && (
                        <LsirScoreChangeSnapshot
                          timeWindow={chartTimeWindow}
                          supervisionType={chartSupervisionType}
                          district={chartDistrict}
                          lsirScoreChangeByMonth={apiData.average_change_lsir_score_by_month}
                          header="lsirScoreChangeSnapshot-header"
                        />
                      )}
                      {geoViewEnabledALSI === true && (
                        <GeoViewTimeChart
                          chartId="lsirScoreChangeSnapshot"
                          chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
                          metricType="counts"
                          timeWindow={chartTimeWindow}
                          supervisionType={chartSupervisionType}
                          keyedByOffice={true}
                          officeData={apiData.site_offices}
                          dataPointsByOffice={apiData.average_change_lsir_score_over_time_window}
                          numeratorKeys={['average_change']}
                          denominatorKeys={[]}
                          centerLat={47.3}
                          centerLong={-100.5}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyLsirScoreChangeSnapshot">
                  <div className="mb-0" id="methodologyHeadingLsirScoreChangeSnapshot">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyLsirScoreChangeSnapshot" aria-expanded="true" aria-controls="collapseMethodologyLsirScoreChangeSnapshot">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyLsirScoreChangeSnapshot" aria-labelledby="methodologyHeadingLsirScoreChangeSnapshot" data-parent="#methodologyLsirScoreChangeSnapshot">
                    <div>
                      <ul>
                        <li>
                        This is the average of the differences between the first
                        reassessment score and the termination assessment score
                        for all individuals whose supervision was scheduled to
                        end in a given month.
                        </li>
                      </ul>
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

export default Snapshots;
