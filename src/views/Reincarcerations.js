import React from "react";

import Loading from "../components/Loading";
import "../assets/styles/index.scss";
import { useAuth0 } from "../react-auth0-spa";

import ReleasesVsAdmissions from "../components/charts/reincarcerations/ReleasesVsAdmissions";
import ReincarcerationRateByReleaseFacility from "../components/charts/reincarcerations/ReincarcerationRateByReleaseFacility";
import ReincarcerationRateByTransitionalFacility from "../components/charts/reincarcerations/ReincarcerationRateByTransitionalFacility";
import ReincarcerationRateByStayLength from "../components/charts/reincarcerations/ReincarcerationRateByStayLength";
import ReincarcerationCountOverTime from "../components/charts/reincarcerations/ReincarcerationCountOverTime";

const Reincarcerations = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <main className="main-content bgc-grey-100">
      <div id="mainContent">
        <div className="row gap-20 masonry pos-r">
          <div className="masonry-sizer col-md-6" />

          {/* #Recidivism driver top-line chart ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">
                    The <span className="font-weight-bold">reincarceration</span> count this month was <span className="font-weight-bold">14</span> over target
                    <span className="fa-pull-right">
                      <div className="dropdown show">
                        <a className="btn btn-secondary btn-sm dropdown-toggle" href="#" role="button" id="exportDropdownMenuButton-reincarcerationDrivers" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Export
                        </a>
                        <div className="dropdown-menu" aria-labelledby="exportDropdownMenuButton-reincarcerationDrivers">
                          <a className="dropdown-item" id="downloadChartAsImage-reincarcerationDrivers" href="javascript:void(0);">Export image</a>
                          <a className="dropdown-item" id="downloadChartData-reincarcerationDrivers" href="javascript:void(0);">Export data</a>
                        </div>
                      </div>
                    </span>
                  </h4>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="col-md-12">
                    <div className="layer w-100 p-20">
                      <ReincarcerationCountOverTime />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRecidivismDriver">
                  <div className="mb-0" id="methodologyHeadingRecidivismDriver">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRecidivismDriver" aria-expanded="true" aria-controls="collapseMethodologyRecidivismDriver">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyRecidivismDriver" className="collapse" aria-labelledby="methodologyHeadingRecidivismDriver" data-parent="#methodologyRecidivismDriver">
                    <div>
                      <ul>
                        <li>Total admissions include unique people admitted to any DOCR prison during a particular time frame.</li>
                        <li>Sentence length refers to the maximum sentence length that the person received in response to the offense that led to the reincarceration.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Releases vs admissions ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">The ND facilities <span className="font-weight-bold">grew</span> by <span className="font-weight-bold">22</span> people this month</h4>
                </div>
                <div className="layer w-100 p-20">
                  <ReleasesVsAdmissions />
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReleasesVsAdmissions">
                  <div className="mb-0" id="methodologyHeadingReleasesVsAdmissions">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReleasesVsAdmissions" aria-expanded="true" aria-controls="collapseMethodologyReleasesVsAdmissions">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReleasesVsAdmissions" className="collapse" aria-labelledby="methodologyHeadingReleasesVsAdmissions" data-parent="#methodologyReleasesVsAdmissions">
                    <div>
                      <ul>
                        <li>Total admissions include unique people admitted to any DOCR prison during a particular time frame.</li>
                        <li>Total releases include unique people released from any DOCR prison, to either a term of supervision or total freedom, during a particular time frame.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Reincarcerations by release facility ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">Reincarceration rate by release facility</h6>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <ReincarcerationRateByReleaseFacility />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationsByFacility">
                  <div className="mb-0" id="methodologyHeadingReincarcerationsByFacility">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationsByFacility" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationsByFacility">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationsByFacility" className="collapse" aria-labelledby="methodologyHeadingReincarcerationsByFacility" data-parent="#methodologyReincarcerationsByFacility">
                    <div>
                      <ul>
                        <li>Reincarceration cohorts include only those admissions which resulted from an incarceration, due to a new offense, of a person who was previously incarcerated in a DOCR prison. The reincarceration must have happened within the noted follow up period directly after their release.</li>
                        <li>Reincarcerations are counted towards the facility where the person was released from, regardless of time spent in various facilities.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Release Cohort</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">2017</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Follow Up Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">1 year</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Type</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">New offenses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Reincarcerations by transitional facility ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">Reincarceration rate by transitional facility</h6>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <ReincarcerationRateByTransitionalFacility />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationsByFacility">
                  <div className="mb-0" id="methodologyHeadingReincarcerationsByFacility">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationsByFacility" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationsByFacility">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationsByFacility" className="collapse" aria-labelledby="methodologyHeadingReincarcerationsByFacility" data-parent="#methodologyReincarcerationsByFacility">
                    <div>
                      <ul>
                        <li>Reincarceration cohorts include only those admissions which resulted from an incarceration, due to a new offense, of a person who was previously incarcerated in a DOCR prison. The reincarceration must have happened within the noted follow up period directly after their release.</li>
                        <li>Reincarcerations are counted towards the facility where the person was released from, regardless of time spent in various facilities.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Release Cohort</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">2017</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Follow Up Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">1 year</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Type</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">New offenses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Reincarcerations by previous stay length ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Reincarceration rate by previous stay length</h4>
                </div>
                <div className="layer w-100 p-20">
                  <ReincarcerationRateByStayLength />
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationsByStayLength">
                  <div className="mb-0" id="methodologyHeadingReincarcerationsByStayLength">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationsByStayLength" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationsByStayLength">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationsByStayLength" className="collapse" aria-labelledby="methodologyHeadingReincarcerationsByStayLength" data-parent="#methodologyReincarcerationsByStayLength">
                    <div>
                      <ul>
                        <li>Reincarceration cohorts include only those admissions which resulted from an incarceration, due to a new offense, of a person who was previously incarcerated in a DOCR prison. The reincarceration must have happened within the noted follow up period directly after their release.</li>
                        <li>Stay length refers to time actually spent incarcerated prior to their most recent release from a DOCR prison. This is bucketed into 12-month windows for sampling.</li>
                        <li><a href="methodology.html" target="_blank">Read more...</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Release Cohort</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">2017</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Follow Up Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">1 year</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Return Type</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">New offenses</span>
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
