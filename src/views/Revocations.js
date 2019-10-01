import React, { useState, useEffect } from 'react';

import Loading from '../components/Loading';
import '../assets/styles/index.scss';
import { useAuth0 } from '../react-auth0-spa';

import RevocationCountOverTime from '../components/charts/revocations/RevocationCountOverTime';
import RevocationCountBySupervisionType from '../components/charts/revocations/RevocationCountBySupervisionType';
import RevocationCountByViolationType from '../components/charts/revocations/RevocationCountByViolationType';
import RevocationCountByOfficer from '../components/charts/revocations/RevocationCountByOfficer';
import AdmissionTypeProportions from '../components/charts/revocations/AdmissionTypeProportions';
import RevocationProportionByRace from '../components/charts/revocations/RevocationProportionByRace';
import RevocationsByCounty from '../components/charts/revocations/RevocationsByCounty';

const Revocations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/revocations`, {
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

          {/* #Revocation counts by month chart ==================== */}
          <div className="col-md-12">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h6 className="lh-1">
                    REVOCATIONS BY MONTH
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
                  </h6>
                </div>
                <div className="layer w-100 pX-20 pT-20">
                  <h4 style={{ height: '20px' }} className="lh-1" id="revocationCountsByMonth-header" />
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="col-md-12">
                    <div className="layer w-100 p-20">
                      <RevocationCountOverTime
                        revocationCountsByMonth={apiData.revocations_by_month}
                        header="revocationCountsByMonth-header"
                      />
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationCountsByMonth">
                  <div className="mb-0" id="methodologyHeadingRevocationCountsByMonth">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationCountsByMonth" aria-expanded="true" aria-controls="collapseMethodologyRevocationCountsByMonth">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div id="collapseMethodologyRevocationCountsByMonth" className="collapse" aria-labelledby="methodologyHeadingRevocationCountsByMonth" data-parent="#methodologyRevocationCountsByMonth">
                    <div>
                      <ul>
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          because their supervision was revoked.
                        </li>
                        <li>
                          Violations include all behavioral violations officially recorded by a
                          supervision officer, including new offenses, technical violations, and
                          absconsion.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by supervision type ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by supervision type</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountBySupervisionType
                    revocationCountsByMonthBySupervisionType={
                      apiData.revocations_by_supervision_type_by_month
                    }
                  />
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
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          because their supervision was revoked.
                        </li>
                        <li>
                          Violations include all behavioral violations officially recorded by a
                          supervision officer, including new offenses, technical violations, and
                          absconsion.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by violation type ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by violation type</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountByViolationType
                    revocationCountsByMonthByViolationType={
                      apiData.revocations_by_violation_type_by_month
                    }
                  />
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
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          because their supervision was revoked.
                        </li>
                        <li>
                          Violations include all behavioral violations officially recorded by a
                          supervision officer, including new offenses, technical violations, and
                          absconsion.
                        </li>
                        <li>
                          Violations of "Unknown Type" indicate individuals who were admitted to
                          prison for a supervision revocation where the violation that caused the
                          revocation cannot yet be determined.
                        </li>
                        <li>
                          "Technical" revocations include only those revocations which result solely
                          from a technical violation. If there is a violation that includes a new
                          offense or an absconsion, it is considered a non-technical revocation.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Revocations by county chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by county</h4>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <RevocationsByCounty
                      revocationsByCounty={apiData.revocations_by_county_60_days}
                    />
                  </div>
                </div>
                <div className="layer bdT p-20 w-100 accordion" id="methodologyRevocationsByCounty">
                  <div className="mb-0" id="methodologyHeadingsRevocationsByCounty">
                    <div className="mb-0">
                      <button className="btn btn-link collapsed pL-0" type="button" data-toggle="collapse" data-target="#collapseMethodologyRevocationsByCounty" aria-expanded="true" aria-controls="collapseMethodologyRevocationsByCounty">
                        <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
                      </button>
                    </div>
                  </div>
                  <div className="collapse" id="collapseMethodologyRevocationsByCounty" aria-labelledby="methodologyHeadingRevocationsByCounty" data-parent="#methodologyRevocationsByCounty">
                    <div>
                      <ul>
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          because their supervision was revoked.
                        </li>
                        <li>
                          Revocations are attributed to the county where the person&apos;s
                          supervision was terminated.
                        </li>
                        <li>
                          Revocations are included based on the date that the person&apos;s
                          supervision was officially revoked, not the date of the causal violation
                          or offense.
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

          {/* #Revocations by officer id ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by officer</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RevocationCountByOfficer
                    revocationCountsByOfficer={apiData.revocations_by_officer_60_days}
                  />
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
                        <li>
                          This chart lists the 10 officers with the highest revocation counts in the
                          state over the period.
                        </li>
                        <li>
                          Revocations are counted towards an officer if that officer is flagged as
                          the terminating officer at the time of a person&apos;s revocation.
                        </li>
                        <li>
                          Revocations are included based on the date that the person&apos;s
                          supervision was officially revoked, not the date of the causal violation
                          or offense.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Period </small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Last 60 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Admission type proportions ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Admission type proportions</h4>
                </div>
                <div className="layer w-100 p-20">
                  <AdmissionTypeProportions
                    admissionCountsByType={apiData.admissions_by_type_60_days}
                  />
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
                        <li>
                          New admissions include unique people admitted to any DOCR facility during
                          a particular time frame, regardless of whether they were previously
                          incarcerated.
                        </li>
                        <li>
                          Revocations counts include the number of people incarcerated because their
                          supervision period was revoked for a behavioral violation.
                        </li>
                        <li>
                          "Technical Revocations" include only those revocations which result solely
                          from a technical violation. If there is a violation that includes a new
                          offense or an absconsion, it is considered a "Non-Technical Revocation".
                        </li>
                        <li>
                          Revocations of "Unknown Type" indicate individuals who were admitted to
                          prison for a supervision revocation where the violation that caused the
                          revocation cannot yet be determined.
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

          {/* #Revocations by race chart ==================== */}
          <div className="col-md-6">
            <div className="bd bgc-white p-20">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Revocations by race</h4>
                </div>
                <div className="layer w-100 pX-20 pT-20 row">
                  <div className="layer w-100 p-20">
                    <RevocationProportionByRace
                      revocationProportionByRace={
                        apiData.revocations_by_race_and_ethnicity_60_days}
                      supervisionPopulationByRace={
                        apiData.supervision_population_by_race_and_ethnicity_60_days
                      }
                    />
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
                        <li>
                          Revocation counts include the number of people who were incarcerated
                          because their supervision was revoked.
                        </li>
                        <li>
                          The supervision population counts people on probation or parole in North
                          Dakota at any point during the time period.
                        </li>
                        <li>
                          The race proportions for the population of North Dakota were taken from
                          the U.S. Census Bureau.
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

export default Revocations;
