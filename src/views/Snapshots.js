import React, { useState, useEffect } from 'react';

import Loading from '../components/Loading';
import '../assets/styles/index.scss';
import { useAuth0 } from '../react-auth0-spa';

import SupervisionSuccessSnapshot from '../components/charts/snapshots/SupervisionSuccessSnapshot';
import RevocationAdmissionsSnapshot from '../components/charts/snapshots/RevocationAdmissionsSnapshot';
import LsirScoreChangeSnapshot from '../components/charts/snapshots/LsirScoreChangeSnapshot';
import DaysAtLibertySnapshot from '../components/charts/snapshots/DaysAtLibertySnapshot';


const Snapshots = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/snapshots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      setApiData(responseData);
      setAwaitingApi(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading || !user || awaitingApi) {
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
                  <div className="snapshot-header" id="supervisionSuccessSnapshot-header" />
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
                  <div className="snapshot-header" id="revocationAdmissionsSnapshot-header" />
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
                        North Dakota prisons that were due to parole or probation revocations.
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

          {/* #Average days at liberty ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    AVERAGE DAYS AT LIBERTY
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
                  <div className="snapshot-header" id="daysAtLibertySnapshot-header" />
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <DaysAtLibertySnapshot
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

          {/* #Change in LSIR scores ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    AVERAGE CHANGE IN LSIR SCORES
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-lsirScoreChangeSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-lsirScoreChangeSnapshot">
                          <a className="dropdown-item" id="downloadChartAsImage-lsirScoreChangeSnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-lsirScoreChangeSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <div className="snapshot-header" id="lsirScoreChangeSnapshot-header" />
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <LsirScoreChangeSnapshot
                        lsirScoreChangeByMonth={apiData.average_change_lsir_score_by_month}
                        header="lsirScoreChangeSnapshot-header"
                      />
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
