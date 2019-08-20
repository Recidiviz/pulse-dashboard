import React, { useState, useEffect } from "react";

import Loading from "../components/Loading";
import "../assets/styles/index.scss";
import { useAuth0 } from "../react-auth0-spa";

import RevocationCountOverTime from "../components/charts/revocations/RevocationCountOverTime";
import RevocationCountBySupervisionType from "../components/charts/revocations/RevocationCountBySupervisionType";
import RevocationCountByViolationType from "../components/charts/revocations/RevocationCountByViolationType";
import RevocationCountByOfficer from "../components/charts/revocations/RevocationCountByOfficer";
import AdmissionTypeProportions from "../components/charts/revocations/AdmissionTypeProportions";
import RevocationProportionByRace from "../components/charts/revocations/RevocationProportionByRace";

const Revocations = () => {
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
      setApiData(responseData.external);
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
        <div className="row gap-20 masonry pos-r">
          <div className="masonry-sizer col-md-6" />

          {/* #Revocation driver top-line chart ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">
                    The <span className="font-weight-bold">revocation</span> count this month was <span className="font-weight-bold">10</span> over target
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-revocationDrivers" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-revocationDrivers">
                          <a className="dropdown-item" id="downloadChartAsImage-revocationDrivers" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-revocationDrivers" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h4>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="col-md-12">
                    <div className="layer w-100 p-20">
                      <RevocationCountOverTime revocationCountsByMonth={apiData.revocationCountsByMonth} />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationDriver">
                  <div className="mb-0" id="methodologyHeadingRevocationDriver">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationDriver" aria-expanded="true" aria-controls="collapseMethodologyRevocationDriver">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyRevocationDriver" className="collapse" aria-labelledby="methodologyHeadingRevocationDriver" data-parent="#methodologyRevocationDriver">
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
              </div>
            </div>
          </div>

          {/* #Revocations by supervision type ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by supervision type</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountBySupervisionType revocationCountsByMonthBySupervisionType={apiData.revocationCountsByMonthBySupervisionType} />
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationBySupervisionType">
                  <div className="mb-0" id="methodologyHeadingRevocationBySupervisiontype">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationBySupervisionType" aria-expanded="true" aria-controls="collapseMethodologyRevocationBySupervisionType">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyRevocationBySupervisionType" aria-labelledby="methodologyHeadingRevocationBySupervisiontype" data-parent="#methodologyRevocationBySupervisionType">
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
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600"><small className="c-grey-500 fw-600">Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by violation type ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by violation type</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountByViolationType revocationCountsByMonthByViolationType={apiData.revocationCountsByMonthByViolationType} />
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
                        <li>Violations include all behavioral violations officially recorded by a supervision officer, including new offenses, technical violations, and absconsion.</li>
                        <li>Revocations include all instances of a person having any form of supervision revoked for any behavioral violation, and being reincarcerated as a result.</li>
                        <li>Technical revocations include only those revocations which result only from a technical violation and/or absconsion. If there is a technical violation in addition to a new offense, it is considered a non-technical revocation.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600"><small className="c-grey-500 fw-600">Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by officer ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by officer</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountByOfficer revocationCountsByOfficer={apiData.revocationCountsByOfficer} />
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
                        <li>Revocations are counted towards an officer if that officer is flagged as the terminating officer at the time of a person's revocation.</li>
                        <li>Revocations are included based on the date that the revocation was officially sanctioned, not the date of the causal violation or offense.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Admission type proportions ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Admission type proportions</h4>
                </div>
                <div className="layer w-100 p-20">
                  <AdmissionTypeProportions admissionCountsByType={apiData.admissionCountsByType} />
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyAdmissionProportions">
                  <div className="mb-0" id="methodologyHeadingAdmissionProportions">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyAdmissionProportions" aria-expanded="true" aria-controls="collapseMethodologyAdmissionProportions">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyAdmissionProportions" className="collapse" aria-labelledby="methodologyHeadingRevocationByOfficer" data-parent="#methodologyAdmissionProportions">
                    <div>
                      <ul>
                        <li>New admissions include unique people admitted to any DOCR prison during a particular time frame, regardless of whether they were previously incarcerated.</li>
                        <li>Revocations include all instances of a person having any form of supervision revoked for any behavioral violation, and being reincarcerated as a result.</li>
                        <li>Technical revocations include only those revocations which result only from a technical violation and/or absconsion. If there is a technical violation in addition to a new offense, it is considered a non-technical revocation.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by race chart ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by race compared to ND population</h4>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <RevocationProportionByRace revocationProportionByRace={apiData.revocationProportionByRace} />
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
                        <li>Violations include all behavioral violations officially recorded by a supervision officer, including new offenses, technical violations, and absconsion.</li>
                        <li>Revocations include all instances of a person having any form of supervision revoked for any behavioral violation, and being reincarcerated as a result.</li>
                        <li>Technical revocations include only those revocations which result only from a technical violation and/or absconsion. If there is a technical violation in addition to a new offense, it is considered a non-technical revocation.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600"><small className="c-grey-500 fw-600">Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
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
