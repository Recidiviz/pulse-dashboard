import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loading from "../components/Loading";
import "../assets/styles/index.scss";
import { configureDownloadButtons } from "../assets/scripts/charts/chartJS/downloads";
import { useAuth0 } from "../react-auth0-spa";

import SupervisionSuccessSnapshot from "../components/charts/snapshots/SupervisionSuccessSnapshot";
import ReincarcerationCountSnapshot from "../components/charts/snapshots/ReincarcerationCountSnapshot";

const Snapshots = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationSnapshot" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationSnapshot">
                          <a className="dropdown-item" id="downloadChartAsImage-revocationSnapshot" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-revocationSnapshot" href="javascript:void(0);">Export data</a>
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
                    by that time
                  </h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <SupervisionSuccessSnapshot />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationSnapshot">
                  <div className="mb-0" id="methodologyHeadingRevocationSnapshot">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationSnapshot" aria-expanded="true" aria-controls="collapseMethodologyRevocationSnapshot">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyRevocationSnapshot" className="collapse" aria-labelledby="methodologyHeadingRevocationSnapshot" data-parent="#methodologyRevocationSnapshot">
                    <div>
                      <ul>
                        <li>Violations include all behavioral violations officially recorded by a supervision officer, including new offenses, technical violations, and absconsion.</li>
                        <li>Revocations include all instances of a person having any form of supervision revoked for any behavioral violation, and being reincarcerated as a result.</li>
                        <li>Technical revocations include only those revocations which result only from a technical violation and/or absconsion. If there is a technical violation in addition to a new offense, it is considered a non-technical revocation.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT pT-20 pX-20 w-100">
                  <div className="jc-c gapX-20 row">
                    <a className="col-md-12 explore-the-data" href="/revocations">
                      <h6 className="lh-1 c-blue-500">Dive into the data<i className="ti-arrow-right pull-right" /></h6>
                    </a>
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
                    <b style={{ color: '#809AE5' }}>56% of prison admissions </b>
                    in March 2019 were due to parole or probation revocations.
                  </h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <ReincarcerationCountSnapshot admissions={apiData.admissions} reincarcerationCountsByMonth={apiData.reincarcerationCountsByMonth} />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRecidivismSnapshot">
                  <div className="mb-0" id="methodologyHeadingRecidivismSnapshot">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRecidivismSnapshot" aria-expanded="true" aria-controls="collapseMethodologyRecidivismSnapshot">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyRecidivismSnapshot" className="collapse" aria-labelledby="methodologyHeadingRecidivismSnapshot" data-parent="#methodologyRecidivismSnapshot">
                    <div>
                      <ul>
                        <li>Total admissions include unique people admitted to any DOCR prison during a particular time frame.</li>
                        <li>Reincarceration returns include only those admissions which resulted from an incarceration, due to a new offense, of a person who was previously incarcerated in a DOCR prison.</li>
                        <li>In this case, an admission counts as a reincarceration return if the reincarceration happened within 3 years of the person's most recent release from prison, i.e. a 3-year follow-up period.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT pT-20 pX-20 w-100">
                  <div className="jc-c gapX-20 row">
                    <a className="col-md-12 explore-the-data" href="/reincarcerations">
                      <h6 className="lh-1 c-blue-500">Dive into the data<i className="ti-arrow-right pull-right" /></h6>
                    </a>
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
