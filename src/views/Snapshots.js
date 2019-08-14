import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../components/Loading';
import '../assets/styles/index.scss';
import { configureDownloadButtons } from '../assets/scripts/charts/chartJS/downloads';
import { useAuth0 } from '../react-auth0-spa';

import SupervisionSuccessSnapshot from '../components/charts/snapshots/SupervisionSuccessSnapshot';
import RevocationAdmissionsSnapshot from '../components/charts/snapshots/RevocationAdmissionsSnapshot';
import LSIRScoreChangeSnapshot from '../components/charts/snapshots/LSIRScoreChangeSnapshot'
import DaysAtLibertySnapshot from '../components/charts/snapshots/DaysAtLibertySnapshot'

const Snapshots = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/external`, {
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

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <main className="main-content bgc-grey-100">
      <div id="mainContent">
        <div className="row gap-20 masonry pos-r">
          <div className="masonry-sizer col-md-6" />

          {/* #Revocation snapshot ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    SUCCESSFUL COMPLETION OF SUPERVISION
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-successfulSupervisionSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-successfulSupervisionSnapshot">
                          <a className="dropdown-item" id="downloadChartAsImage-successfulSupervisionSnapshott" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-successfulSupervisionSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">
                    <b style={{ color: '#809AE5' }}>48% of people </b>
                    whose supervision was scheduled to end in March 2019
                    <b style={{ color: '#809AE5' }}> successfully completed their supervision </b>
                    by that time.
                  </h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <SupervisionSuccessSnapshot />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Prison admissions from revocations ==================== */}
          <div className="masonry-item col-md-6">
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
                  <h4 className="lh-1">
                    <b style={{ color: '#809AE5' }}>56% of prison admissions </b>
                    in March 2019 were due to parole or probation revocations.
                  </h4>
                </div>
                <div className="layer w-100 p-40">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <RevocationAdmissionsSnapshot />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Change in LSIR scores ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    AVERAGE CHANGE IN LSIR SCORES
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-LSIRScoreChangeSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-LSIRScoreChangeSnapshot">
                          <a className="dropdown-item" id="downloadChartAsImage-LSIRScoreChangeSnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-LSIRScoreChangeSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">
                    The change in LSIR scores between intake and termination of
                    supervision has been
                    <b style={{ color: '#809AE5' }}> trending towards the goal. </b>
                  </h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <LSIRScoreChangeSnapshot />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Average days at liberty ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    AVERAGE DAYS AT LIBERTY
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-reincarcerationSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-reincarcerationSnapshot">
                          <a className="dropdown-item" id="downloadChartAsImage-reincarcerationSnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-reincarcerationSnapshot" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">
                    The average days between release from
                    incarceration and readmission has been
                    <b style={{ color: '#809AE5' }}> trending away from the goal.</b>
                  </h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <DaysAtLibertySnapshot />
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
