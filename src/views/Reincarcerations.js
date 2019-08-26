import React, { useState, useEffect } from "react";

import Loading from '../components/Loading';
import '../assets/styles/index.scss';
import { useAuth0 } from '../react-auth0-spa';

import AdmissionsVsReleases from '../components/charts/reincarcerations/AdmissionsVsReleases';
import ReincarcerationRateByReleaseFacility from '../components/charts/reincarcerations/ReincarcerationRateByReleaseFacility';
import ReincarcerationRateByTransitionalFacility from '../components/charts/reincarcerations/ReincarcerationRateByTransitionalFacility';
import ReincarcerationRateByStayLength from '../components/charts/reincarcerations/ReincarcerationRateByStayLength';
import ReincarcerationCountOverTime from '../components/charts/reincarcerations/ReincarcerationCountOverTime';

const Reincarcerations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reincarcerations`, {
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
        <div className="row gap-20 masonry pos-r">
          <div className="masonry-sizer col-md-6" />

          {/* #Recidivism driver top-line chart ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REINCARCERATIONS BY MONTH
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
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <h4 style={{ height: '20px' }} className="lh-1" id="reincarcerationDrivers-header">
                  </h4>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="col-md-12">
                    <div className="layer w-100 p-20">
                      <ReincarcerationCountOverTime
                        reincarcerationCountsByMonth={apiData.reincarcerations_by_month}
                        header="reincarcerationDrivers-header"
                      />
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
                        <li>An admission to prison counts as a reincarceration if the person has been incarcerated previously and if they were released from their last incarceration within 10 years of the date of the new admission.</li>
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
                  <h4 style={{ height: '20px' }} className="lh-1" id="admissionsVsReleases-header">
                  </h4>
                </div>
                <div className="layer w-100 p-20">
                  <AdmissionsVsReleases
                    admissionsVsReleases={apiData.admissions_versus_releases_by_month}
                    header="admissionsVsReleases-header"
                  />
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
                        <li>"Admissions versus releases" is the difference between the number of people who were admitted to DOCR facilities and the number of people who were released from DOCR facilities during a particular time frame.</li>
                        <li>Admissions include unique people admitted to any DOCR facility during a particular time frame.</li>
                        <li>Releases include unique people released from any DOCR facility, whether released to a term of supervision or not, during a particular time frame.</li>
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
                  <h4 className="lh-1">Reincarceration rate by release facility</h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <ReincarcerationRateByReleaseFacility
                        ratesByReleaseFacility={apiData.reincarceration_rate_by_release_facility}
                      />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationsByReleaseFacility">
                  <div className="mb-0" id="methodologyHeadingReincarcerationsByReleaseFacility">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationsByReleaseFacility" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationsByReleaseFacility">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationsByReleaseFacility" className="collapse" aria-labelledby="methodologyHeadingReincarcerationsByReleaseFacility" data-parent="#methodologyReincarcerationsByReleaseFacility">
                    <div>
                      <ul>
                        <li>Reincarceration cohorts include all admissions to incarceration of a person who was previously incarcerated in a DOCR facility. The reincarceration must have happened within the noted follow up period directly after their release.</li>
                        <li>Reincarcerations are counted towards the facility where the person was released from, regardless of time spent in various facilities.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">
                        <small className="c-grey-500 fw-600">Release Cohort </small>
                        2017
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

          {/* #Reincarcerations by transitional facility ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Reincarceration rate by transitional facility</h4>
                </div>
                <div className="layer w-100 p-20">
                  <div className="ai-c jc-c gapX-20">
                    <div className="col-md-12">
                      <ReincarcerationRateByTransitionalFacility ratesByTransitionalFacility={apiData.reincarceration_rate_by_release_facility} />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyReincarcerationsByTransitionalFacility">
                  <div className="mb-0" id="methodologyHeadingReincarcerationsByTransitionalFacility">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyReincarcerationsByTransitionalFacility" aria-expanded="true" aria-controls="collapseMethodologyReincarcerationsByTransitionalFacility">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyReincarcerationsByTransitionalFacility" className="collapse" aria-labelledby="methodologyHeadingReincarcerationsByTransitionalFacility" data-parent="#methodologyReincarcerationsByTransitionalFacility">
                    <div>
                      <ul>
                        <li>Reincarceration cohorts include all admissions to incarceration of a person who was previously incarcerated in a DOCR facility. The reincarceration must have happened within the noted follow up period directly after their release.</li>
                        <li>Reincarcerations are counted towards the facility where the person was released from, regardless of time spent in various facilities.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">
                        <small className="c-grey-500 fw-600">Release Cohort </small>
                        2017
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

          {/* #Reincarcerations by previous stay length ==================== */}
          <div className="masonry-item col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Reincarceration rate by previous stay length</h4>
                </div>
                <div className="layer w-100 p-20">
                  <ReincarcerationRateByStayLength ratesByStayLength={apiData.reincarceration_rate_by_stay_length} />
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
                        <li>Reincarceration cohorts include all admissions to incarceration of a person who was previously incarcerated in a DOCR facility. The reincarceration must have happened within the noted follow up period directly after their release.</li>
                        <li>Stay length refers to time actually spent incarcerated prior to their most recent release from a DOCR facility. This is bucketed into 12-month windows for sampling.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">
                        <small className="c-grey-500 fw-600">Release Cohort </small>
                        2017
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
