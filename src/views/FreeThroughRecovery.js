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

import FtrReferralCountByMonth from '../components/charts/program_evaluation/us_nd/free_through_recovery/FtrReferralCountByMonth';
import FtrReferralsByRace from '../components/charts/program_evaluation/us_nd/free_through_recovery/FtrReferralsByRace';
import FtrReferralsByGender from '../components/charts/program_evaluation/us_nd/free_through_recovery/FtrReferralsByGender';
import FtrReferralsByAge from '../components/charts/program_evaluation/us_nd/free_through_recovery/FtrReferralsByAge';
import FtrReferralsByLsir from '../components/charts/program_evaluation/us_nd/free_through_recovery/FtrReferralsByLsir';

const FreeThroughRecovery = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('programEvaluation/us_nd/freeThroughRecovery', getTokenSilently);
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

          {/* #FTR referral counts by month chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    FTR REFERRAL COUNT BY MONTH
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-ftrReferralCountByMonth" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-ftrReferralCountByMonth">
                          <a className="dropdown-item" id="downloadChartAsImage-ftrReferralCountByMonth" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-ftrReferralCountByMonth" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <h4 style={{ height: '20px' }} className="dynamic-chart-header" id="ftrReferralCountByMonth-header" />
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="col-md-12">
                    <div className="layer w-100 p-20">
                      <FtrReferralCountByMonth
                        ftrReferralCountByMonth={apiData.ftr_referrals_by_month}
                        header="ftrReferralCountByMonth-header"
                      />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyFtrReferralCountByMonth">
                  <div className="mb-0" id="methodologyHeadingFtrReferralCountByMonth">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyFtrReferralCountByMonth" aria-expanded="true" aria-controls="collapseMethodologyFtrReferralCountByMonth">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyFtrReferralCountByMonth" className="collapse" aria-labelledby="methodologyHeadingFtrReferralCountByMonth" data-parent="#methodologyFtrReferralCountByMonth">
                    <div>
                      <ul>
                        <li>
                          Referral counts include the number of people who were
                          referred to Free Through Recovery.
                        </li>
                        <li>
                          Referrals are included based on the date the person
                          was referred to the program, regardless of when or if
                          they began participating in Free Through Recovery.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #FTR Referrals by Race chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    FTR REFERRALS BY RACE
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-ftrReferralsByRace" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-ftrReferralsByRace">
                          <a className="dropdown-item" id="downloadChartAsImage-ftrReferralsByRace" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-ftrReferralsByRace" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <FtrReferralsByRace
                      ftrReferralsByRace={
                        apiData.ftr_referrals_by_race_and_ethnicity_60_days}
                      supervisionPopulationByRace={
                        apiData.supervision_population_by_race_and_ethnicity_60_days}
                      statePopulationByRace={
                        apiData.race_proportions}
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyFtrReferralsByRace">
                  <div className="mb-0" id="methodologyHeadingsFtrReferralsByRace">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyFtrReferralsByRace" aria-expanded="true" aria-controls="collapseMethodologyFtrReferralsByRace">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyFtrReferralsByRace" aria-labelledby="methodologyHeadingFtrReferralsByRace" data-parent="#methodologyFtrReferralsByRace">
                    <div>
                      <ul>
                        <li>
                          The referral population counts people who were referred to Free Through
                          Recovery at any point during the time period.
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
                          If an individual has more than one race or ethnicity recorded
                          from different data systems, then they are counted once for
                          each unique race and ethnicity. This means that the total count
                          in this chart may be larger than the total number of individuals it describes.
                          This does not apply to the ND Population values.
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

          {/* #FTR Referrals by LSI-R chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    FTR REFERRALS BY LSI-R
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-ftrReferralsByLsir" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-ftrReferralsByLsir">
                          <a className="dropdown-item" id="downloadChartAsImage-ftrReferralsByLsir" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-ftrReferralsByLsir" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <FtrReferralsByLsir
                      ftrReferralsByLsir={
                        apiData.ftr_referrals_by_lsir_60_days}
                      supervisionPopulationByLsir={
                        apiData.supervision_population_by_lsir_60_days
                      }
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyFtrReferralsByLsir">
                  <div className="mb-0" id="methodologyHeadingsFtrReferralsByLsir">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyFtrReferralsByLsir" aria-expanded="true" aria-controls="collapseMethodologyFtrReferralsByLsir">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyFtrReferralsByLsir" aria-labelledby="methodologyHeadingFtrReferralsByLsir" data-parent="#methodologyFtrReferralsByLsir">
                    <div>
                      <ul>
                        <li>
                          Each person’s LSI-R score is based off of the most
                          recent LSI-R assessment performed for that person.
                        </li>
                        <li>
                          The referral population counts people who were
                          referred to Free Through Recovery at any point during
                          the time period.
                        </li>
                        <li>
                          The supervision population counts people on probation
                          or parole in North Dakota at any point during the time
                          period.
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

          {/* #FTR Referrals by Gender chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    FTR REFERRALS BY GENDER
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-ftrReferralsByGender" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-ftrReferralsByGender">
                          <a className="dropdown-item" id="downloadChartAsImage-ftrReferralsByGender" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-ftrReferralsByGender" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <FtrReferralsByGender
                      ftrReferralsByGender={
                        apiData.ftr_referrals_by_gender_60_days}
                      supervisionPopulationByGender={
                        apiData.supervision_population_by_gender_60_days
                      }
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyFtrReferralsByGender">
                  <div className="mb-0" id="methodologyHeadingsFtrReferralsByGender">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyFtrReferralsByGender" aria-expanded="true" aria-controls="collapseMethodologyFtrReferralsByGender">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyFtrReferralsByGender" aria-labelledby="methodologyHeadingFtrReferralsByGender" data-parent="#methodologyFtrReferralsByGender">
                    <div>
                      <ul>
                        <li>
                          The referral population counts people who were
                          referred to Free Through Recovery at any point during
                          the time period.
                        </li>
                        <li>
                          The supervision population counts people on
                          probation or parole in North Dakota at any point
                          during the time period.
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

          {/* #FTR Referrals by Age chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    FTR REFERRALS BY AGE
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-ftrReferralsByAge" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-ftrReferralsByAge">
                          <a className="dropdown-item" id="downloadChartAsImage-ftrReferralsByAge" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-ftrReferralsByAge" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <FtrReferralsByAge
                      ftrReferralsByAge={
                        apiData.ftr_referrals_by_age_60_days}
                      supervisionPopulationByAge={
                        apiData.supervision_population_by_age_60_days
                      }
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyFtrReferralsByAge">
                  <div className="mb-0" id="methodologyHeadingsFtrReferralsByAge">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyFtrReferralsByAge" aria-expanded="true" aria-controls="collapseMethodologyFtrReferralsByAge">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyFtrReferralsByAge" aria-labelledby="methodologyHeadingFtrReferralsByAge" data-parent="#methodologyFtrReferralsByAge">
                    <div>
                      <ul>
                        <li>
                          The referral population counts people who were
                          referred to Free Through Recovery at any point during
                          the time period.
                        </li>
                        <li>
                          The supervision population counts people on
                          probation or parole in North Dakota at any point
                          during the time period.
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

export default FreeThroughRecovery;
