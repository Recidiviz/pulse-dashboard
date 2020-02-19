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

import AdmissionsVsReleases from '../../../components/charts/reincarcerations/AdmissionsVsReleases';
import ReincarcerationCountOverTime
  from '../../../components/charts/reincarcerations/ReincarcerationCountOverTime';
import ReincarcerationRateByStayLength
  from '../../../components/charts/reincarcerations/ReincarcerationRateByStayLength';
import GeoViewTimeChart from '../../../components/charts/GeoViewTimeChart';

import GeoViewToggle from '../../../components/toggles/GeoViewToggle';
import ToggleBar from '../../../components/toggles/ToggleBar';
import * as ToggleDefaults from '../../../components/toggles/ToggleDefaults';

const Reincarcerations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [chartMetricType, setChartMetricType] = useState(ToggleDefaults.metricType);
  const [chartMetricPeriodMonths, setChartMetricPeriodMonths] = useState(ToggleDefaults.metricPeriodMonths);
  const [chartDistrict, setChartDistrict] = useState(ToggleDefaults.district);
  const [geoViewEnabledRCOT, setGeoViewEnabledRCOT] = useState(ToggleDefaults.geoView);
  const [geoViewEnabledAVR, setGeoViewEnabledAVR] = useState(ToggleDefaults.geoView);

  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });

  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('us_nd/reincarcerations', getTokenSilently);
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
          setChartMetricPeriodMonths={setChartMetricPeriodMonths}
          setChartDistrict={setChartDistrict}
          stateCode="US_ND"
          availableDistricts={['US_ND_ADAMS', 'US_ND_BARNES', 'US_ND_BENSON', 'US_ND_BILLSON', 'US_ND_BOTTINEAU', 'US_ND_BOWMAN', 'US_ND_BURKE', 'US_ND_BURLEIGH', 'US_ND_CASS', 'US_ND_CAVALIER', 'US_ND_DICKEY', 'US_ND_DIVIDE', 'US_ND_DUNN', 'US_ND_EDDY', 'US_ND_EMMONS', 'US_ND_FOSTER', 'US_ND_GOLDEN VALLEY', 'US_ND_GRAND FORKS', 'US_ND_GRANT', 'US_ND_GRIGGS', 'US_ND_HETTINGER', 'US_ND_KIDDER', 'US_ND_LAMOURE', 'US_ND_LOGAN', 'US_ND_MCHENRY', 'US_ND_MCINTOSH', 'US_ND_MCKENZIE', 'US_ND_MCLEAN', 'US_ND_MERCER', 'US_ND_MORTON', 'US_ND_MOUNTRAIL', 'US_ND_NELSON', 'US_ND_OLIVER', 'US_ND_PEMBINA', 'US_ND_PIERCE', 'US_ND_RAMSEY', 'US_ND_RANSOM', 'US_ND_RENVILLE', 'US_ND_RICHLAND', 'US_ND_ROLETTE', 'US_ND_SARGENT', 'US_ND_SHERIDAN', 'US_ND_SIOUX', 'US_ND_SLOPE', 'US_ND_STARK', 'US_ND_STEELE', 'US_ND_STUTSMAN', 'US_ND_TOWNER', 'US_ND_TRAILL', 'US_ND_WALSH', 'US_ND_WARD', 'US_ND_WELLS', 'US_ND_WILLIAMS']}
          replaceLa={true}
        />

        <div className="row gap-20 pos-r">

          {/* #Reincarcerations by month chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REINCARCERATIONS BY MONTH
                    <span className="fa-pull-right">
                      <div className="geo-view-button pR-10">
                        <GeoViewToggle setGeoViewEnabled={setGeoViewEnabledRCOT} />
                      </div>
                      <div className="dropdown show export-button">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-reincarcerationCountsByMonth" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-reincarcerationCountsByMonth">
                          {geoViewEnabledRCOT === false && (
                            <a className="dropdown-item" id="downloadChartAsImage-reincarcerationCountsByMonth" href="javascript:void(0);">Export image</a>
                          )}
                          <a className="dropdown-item" id="downloadChartData-reincarcerationCountsByMonth" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  {geoViewEnabledRCOT === false && (
                    <div className="dynamic-chart-header" id="reincarcerationCountsByMonth-header" />
                  )}
                </div>
                <div className="layer w-100 p-20">
                  {geoViewEnabledRCOT === false && (
                    <ReincarcerationCountOverTime
                      metricType={chartMetricType}
                      metricPeriodMonths={chartMetricPeriodMonths}
                      district={chartDistrict}
                      reincarcerationCountsByMonth={apiData.reincarcerations_by_month}
                      header="reincarcerationCountsByMonth-header"
                    />
                  )}
                  {geoViewEnabledRCOT === true && (
                    <GeoViewTimeChart
                      chartId="reincarcerationCountsByMonth"
                      chartTitle="REINCARCERATIONS BY MONTH"
                      metricType={chartMetricType}
                      metricPeriodMonths={chartMetricPeriodMonths}
                      keyedByOffice={false}
                      stateCode="us_nd"
                      dataPointsByOffice={apiData.reincarcerations_by_period}
                      numeratorKeys={['returns']}
                      denominatorKeys={['total_admissions']}
                      centerLat={47.3}
                      centerLong={-100.5}
                    />
                  )}
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationCountsByMonth">
                  <div className="mb-0" id="methodologyHeadingReincarcerationCountsByMonth">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationCountsByMonth" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationCountsByMonth">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationCountsByMonth" className="collapse" aria-labelledby="methodologyHeadingReincarcerationCountsByMonth" data-parent="#methodologyReincarcerationCountsByMonth">
                    <div>
                      <ul>
                        <li>
                          An admission to prison counts as a reincarceration if
                          the person has been incarcerated previously in a North
                          Dakota prison.
                        </li>
                        <li>
                          Reincarcerations are included regardless of when the initial incarceration
                          took place. There is no upper bound on the follow up period in
                          this metric.
                        </li>
                        <li>
                          In rate mode, this shows the percent of all admissions in the month that
                          were reincarcerations.
                        </li>
                        <li>
                          A location choice narrows down information to only reincarcerations of
                          individuals who lived in that location prior to reincarceration.
                        </li>
                        <li>
                          Selecting a location while in rate mode calculates the percentage of
                          prison admissions in a month from that location that were
                          reincarcerations.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Releases vs admissions ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    ADMISSIONS VERSUS RELEASES
                    <span className="fa-pull-right">
                      <div className="geo-view-button pR-10">
                        <GeoViewToggle setGeoViewEnabled={setGeoViewEnabledAVR} />
                      </div>
                      <div className="dropdown show export-button">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-admissionsVsReleases" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-admissionsVsReleases">
                          {geoViewEnabledAVR === false && (
                            <a className="dropdown-item" id="downloadChartAsImage-admissionsVsReleases" href="javascript:void(0);">Export image</a>
                          )}
                          <a className="dropdown-item" id="downloadChartData-admissionsVsReleases" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  {geoViewEnabledAVR === false && (
                    <div className="dynamic-chart-header" id="admissionsVsReleases-header" />
                  )}
                </div>
                <div className="layer w-100 p-20">
                  {geoViewEnabledAVR === false && (
                    <AdmissionsVsReleases
                      metricType={chartMetricType}
                      metricPeriodMonths={chartMetricPeriodMonths}
                      district={chartDistrict}
                      admissionsVsReleases={apiData.admissions_versus_releases_by_month}
                      header="admissionsVsReleases-header"
                    />
                  )}
                  {geoViewEnabledAVR === true && (
                    <GeoViewTimeChart
                      chartId="admissionsVsReleases"
                      chartTitle="ADMISSIONS VERSUS RELEASES"
                      metricType={chartMetricType}
                      metricPeriodMonths={chartMetricPeriodMonths}
                      keyedByOffice={false}
                      possibleNegativeValues
                      stateCode="us_nd"
                      dataPointsByOffice={apiData.admissions_versus_releases_by_period}
                      numeratorKeys={['population_change']}
                      denominatorKeys={['month_end_population']}
                      centerLat={47.3}
                      centerLong={-100.5}
                    />
                  )}
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyAdmissionsVsReleases">
                  <div className="mb-0" id="methodologyHeadingAdmissionsVsReleases">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyAdmissionsVsReleases" aria-expanded="true" aria-controls="collapseMethodologyAdmissionsVsReleases">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyAdmissionsVsReleases" className="collapse" aria-labelledby="methodologyHeadingAdmissionsVsReleases" data-parent="#methodologyAdmissionsVsReleases">
                    <div>
                      <ul>
                        <li>
                          "Admissions versus releases" is the difference between the number of
                          people who were admitted to DOCR facilities and the number of people who
                          were released from DOCR facilities during a particular time frame.
                        </li>
                        <li>
                          Admissions include unique people admitted to any DOCR facility during a
                          particular time frame.
                        </li>
                        <li>
                          Releases include unique people released from any DOCR facility, whether
                          released to a term of supervision or not, during a particular time frame.
                        </li>
                        <li>
                          In rate mode, this shows the percent change in facility size since the
                          previous month. For July, this would be calculated as (Admissions in
                          July - Releases in July) / (Facility size on June 30th).
                        </li>
                        <li>
                          A location choice narrows down information to only reincarcerations of
                          individuals who lived in that location prior to reincarceration.
                        </li>
                        <li>
                          If the facility size is ever 0 in a month and there is an admission in
                          the next month, the rate is shown as a 100% increase. This may occur, for
                          example, if a county is selected that prior to a given month had no
                          individuals but someone from that county was incarcerated in the given
                          month.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Reincarcerations by previous stay length ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REINCARCERATION RATE BY PREVIOUS STAY LENGTH
                    {(chartMetricType !== 'rates' || (chartMetricPeriodMonths !== '12')) && (
                      <span className="pL-10 toggle-alert ti-alert" data-toggle="tooltip" data-placement="bottom" title="This graph is showing the reincarceration rate by previous stay length with the follow up period noted below. It cannot show this metric as a count. It also does not show follow up periods other than 1 year." />
                    )}
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-reincarcerationRateByStayLength" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-reincarcerationRateByStayLength">
                          <a className="dropdown-item" id="downloadChartAsImage-reincarcerationRateByStayLength" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-reincarcerationRateByStayLength" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 p-20">
                  <ReincarcerationRateByStayLength
                    district={chartDistrict}
                    ratesByStayLength={apiData.reincarceration_rate_by_stay_length}
                  />
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationRateByStayLength">
                  <div className="mb-0" id="methodologyHeadingReincarcerationRateByStayLength">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationRateByStayLength" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationRateByStayLength">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationRateByStayLength" className="collapse" aria-labelledby="methodologyHeadingReincarcerationRateByStayLength" data-parent="#methodologyReincarcerationRateByStayLength">
                    <div>
                      <ul>
                        <li>
                          Reincarceration cohorts include all admissions to incarceration of a
                          person who was previously incarcerated in a DOCR facility. The
                          reincarceration must have happened within the noted follow up period
                          directly after their release.
                        </li>
                        <li>
                          Stay length refers to time actually spent incarcerated prior to their most
                          recent release from a DOCR facility. This is bucketed into 12-month
                          windows for sampling.
                        </li>
                        <li>
                          A location choice narrows down information to only reincarcerations of
                          individuals who lived in that location prior to reincarceration.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">
                        {/* TODO(138): Make the release cohort year dynamic ================ */}
                        <small className="c-grey-500 fw-600">Release Cohort </small>
                        2018
                      </span>
                    </div>
                    <div className="peer fw-600">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">
                        <small className="c-grey-500 fw-600">Follow Up Period </small>
                        1 year
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

export default Reincarcerations;
