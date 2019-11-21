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

const Snapshots = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('us_mo/snapshots', getTokenSilently);
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
                          <a className="dropdown-item" id="downloadChartAsImage-supervisionSuccessSnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-supervisionSuccessSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <div className="dynamic-chart-header" id="supervisionSuccessSnapshot-header" />
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <SupervisionSuccessSnapshot
                        supervisionSuccessRates={apiData.supervision_termination_by_type_by_month}
                        header="supervisionSuccessSnapshot-header"
                      />
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
                          <a className="dropdown-item" id="downloadChartAsImage-revocationAdmissionsSnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-revocationAdmissionsSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <div className="dynamic-chart-header" id="revocationAdmissionsSnapshot-header" />
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <RevocationAdmissionsSnapshot
                        revocationAdmissionsByMonth={apiData.admissions_by_type_by_month}
                        header="revocationAdmissionsSnapshot-header"
                      />
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
                        Missouri prisons that were due to parole or probation revocations.
                        </li>
                        <li>
                        Revocations count all people who were incarcerated
                        because their supervision was revoked.
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
