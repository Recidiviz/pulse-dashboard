import React, { useState, useEffect } from "react";

import Loading from "../components/Loading";
import "../assets/styles/index.scss";
import { useAuth0 } from "../react-auth0-spa";

import RecidivismRateByProgram from "../components/charts/programEvaluation/RecidivismRateByProgram";
import ProgramCostEffectiveness from "../components/charts/programEvaluation/ProgramCostEffectiveness";

const REPORT_CARD_A = {
  "title": "Program A",
  "description": "This program is a group of educational exams which, when passed, provide certification that the test taker has high-school level academic skills. It is an accredited alternative to a high-school diploma, taught by accredited teachers. A GED certificate can significantly increase opportunity for employment and higher education.",
  "type": "Educational",
  "method": "Class instruction",
  "dosage": "20-22 weeks",
  "completionRate": "71%",
  "cost": "$1,500",
  "firstYearEmployment": "42%",
  "thirdYearEmployment": "61%",
  "firstYearReincarceration": "17.5%",
  "thirdYearReincarceration": "22.1%",
  "firstYearRevocation": "9.4%",
  "thirdYearRevocation": "17.2%",
}

const REPORT_CARD_B = {
  "title": "Program B",
  "description": "This program provides group-based therapy targeted at the mitigation of thinking errors and ambient negativity through careful examination of each student's personal history. Providing students with a safe space to be vulnerable promotes self-awareness and self-worth.",
  "type": "Treatment",
  "method": "Group therapy",
  "dosage": "16 weeks",
  "completionRate": "63%",
  "cost": "$1,350",
  "firstYearEmployment": "46%",
  "thirdYearEmployment": "55%",
  "firstYearReincarceration": "13.1%",
  "thirdYearReincarceration": "14.4%",
  "firstYearRevocation": "12.9%",
  "thirdYearRevocation": "15.2%",
}

const REPORT_CARD_C = {
  "title": "Program C",
  "description": "This program brings in local business owners to provide guidance on founding a successful venture. Instruction focuses on building the self-confidence and focus necessary to succeed in high-pressure situations. Capstone projects, sponsored by local organizations, provide students the chance to showcase their ideas and skills.",
  "type": "Vocational",
  "method": "Class instruction",
  "dosage": "24 weeks",
  "completionRate": "78%",
  "cost": "$1,800",
  "firstYearEmployment": "52%",
  "thirdYearEmployment": "60%",
  "firstYearReincarceration": "14.4%",
  "thirdYearReincarceration": "16.1%",
  "firstYearRevocation": "17.3%",
  "thirdYearRevocation": "21.0%",
}

const REPORT_CARD_D = {
  "title": "Program D",
  "description": "This program employs incarcerated individuals to produce quality products for commercial and industrial clients. Using high quality machinery in a secure workshop on site, students prepare for careers in a variety of useful trades, and nurture their creativity and relationship building skills.",
  "type": "Vocational",
  "method": "Class instruction",
  "dosage": "Open entry/exit",
  "completionRate": "68%",
  "cost": "$2,100",
  "firstYearEmployment": "65%",
  "thirdYearEmployment": "71%",
  "firstYearReincarceration": "13.7%",
  "thirdYearReincarceration": "18.1%",
  "firstYearRevocation": "12.3%",
  "thirdYearRevocation": "17.1%",
}

const REPORT_CARD_E = {
  "title": "Program E",
  "description": "This program leverages a network of local business partners hoping to hire newly released individuals looking to ensure a stable reentry into their community. A series of converations and exercises help match individuals soon to be released with prospective employers to secure gainful employment.",
  "type": "Vocational",
  "method": "One-on-one",
  "dosage": "Open entry/exit",
  "completionRate": "N/A",
  "cost": "$1,750",
  "firstYearEmployment": "68%",
  "thirdYearEmployment": "73%",
  "firstYearReincarceration": "18.3%",
  "thirdYearReincarceration": "21.8%",
  "firstYearRevocation": "16.2%",
  "thirdYearRevocation": "17.7%",
}

const REPORT_CARD_F = {
  "title": "Program F",
  "description": "This is a treatment program geared towards the emphasis of both positive and negative feedback to curb the abuse and distribution of hard drugs. Targeted treatment is provided by medical professionals with support from correctional officers to identify and report on counterproductive behaviors.",
  "type": "Treatment",
  "method": "One-on-one",
  "dosage": "Open entry/exit",
  "completionRate": "N/A",
  "cost": "$1,600",
  "firstYearEmployment": "40%",
  "thirdYearEmployment": "47%",
  "firstYearReincarceration": "19.9%",
  "thirdYearReincarceration": "25.5%",
  "firstYearRevocation": "17.2%",
  "thirdYearRevocation": "21.5%",
}

const CARDS = {
  "report-card-program-a": REPORT_CARD_A,
  "report-card-program-b": REPORT_CARD_B,
  "report-card-program-c": REPORT_CARD_C,
  "report-card-program-d": REPORT_CARD_D,
  "report-card-program-e": REPORT_CARD_E,
  "report-card-program-f": REPORT_CARD_F,
}

const ProgramEvaluation = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});

  const [reportCardTitle, setReportCardTitle] = useState(REPORT_CARD_A.title);
  const [reportCardDescription, setReportCardDescription] = useState(REPORT_CARD_A.description);
  const [reportCardType, setReportCardType] = useState(REPORT_CARD_A.type);
  const [reportCardMethod, setReportCardMethod] = useState(REPORT_CARD_A.method);
  const [reportCardDosage, setReportCardDosage] = useState(REPORT_CARD_A.dosage);
  const [reportCardCompletionRate, setReportCardCompletionRate] = useState(REPORT_CARD_A.completionRate);
  const [reportCardCost, setReportCardCost] = useState(REPORT_CARD_A.cost);
  const [reportCardEmployment1, setReportCardEmployment1] = useState(REPORT_CARD_A.firstYearEmployment);
  const [reportCardEmployment3, setReportCardEmployment3] = useState(REPORT_CARD_A.thirdYearEmployment);
  const [reportCardReincarceration1, setReportCardReincarceration1] = useState(REPORT_CARD_A.firstYearReincarceration);
  const [reportCardReincarceration3, setReportCardReincarceration3] = useState(REPORT_CARD_A.thirdYearReincarceration);
  const [reportCardRevocation1, setReportCardRevocation1] = useState(REPORT_CARD_A.firstYearRevocation);
  const [reportCardRevocation3, setReportCardRevocation3] = useState(REPORT_CARD_A.thirdYearRevocation);

  const loadReportCard = (programId) => {
    const card = CARDS[programId];
    setReportCardTitle(card.title);
    setReportCardDescription(card.description);
    setReportCardType(card.type);
    setReportCardMethod(card.method);
    setReportCardDosage(card.dosage);
    setReportCardCompletionRate(card.completionRate);
    setReportCardCost(card.cost);
    setReportCardEmployment1(card.firstYearEmployment);
    setReportCardEmployment3(card.thirdYearEmployment);
    setReportCardReincarceration1(card.firstYearReincarceration);
    setReportCardReincarceration3(card.thirdYearReincarceration);
    setReportCardRevocation1(card.firstYearRevocation);
    setReportCardRevocation3(card.thirdYearRevocation);
  }

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
      <script src="../../assets/scripts/metrics/programReportCards.js" />
      <div id="mainContent">
        <h5 className="lh-1 font-weight-bold pB-20">Note: The following charts describe fake programs with fake data.</h5>

        <div className="row gap-20 masonry pos-r">
          <div className="masonry-sizer col-md-6" />

          {/* #Recidivism by program ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1">Recidivism rate for <b>Program A</b> was <b>4.2%</b> below baseline</h4>
                </div>
                <div className="layer w-100 p-20">
                  <RecidivismRateByProgram recidivismRateByProgram={apiData.recidivismRateByProgram} />
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Release Cohort</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">2015</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Follow Up Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">3 years</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Type</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">New offenses, Revocations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* #Program cost effectiveness ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h4 className="lh-1"><b>Program B</b> saved ND <b>$704,000</b> per 100 participants</h4>
                </div>
                <div className="layer w-100 p-20">
                  <ProgramCostEffectiveness programCostEffectiveness={apiData.programCostEffectiveness} />
                </div>
                <div className="layer bdT p-20 w-100">
                  <div className="peers ai-c jc-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Release Cohort</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">2015</span>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Follow Up Period</small>
                      <span className="fsz-def fw-600 mR-10 c-grey-800">3 years</span>
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

          {/* #Program report list ==================== */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20 pB-10">
                  <h4 className="lh-1">Program report cards</h4>
                </div>
                <div onClick={() => loadReportCard('report-card-program-a')} className="layer bdT p-20 w-100 program-report-card-list">
                  <div className="peers ai-c gapX-20">
                    <div className="peer peer-greed">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Program A</span>
                    </div>
                    <div className="peer">
                      <i className="ti-angle-right" />
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Educational</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Class instruction</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">20-22 weeks</small>
                    </div>
                  </div>
                </div>
                <div onClick={() => loadReportCard('report-card-program-b')} className="layer bdT p-20 w-100 program-report-card-list">
                  <div className="peers ai-c gapX-20">
                    <div className="peer peer-greed">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Program B</span>
                    </div>
                    <div className="peer">
                      <i className="ti-angle-right" />
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Treatment</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Group therapy</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">16 weeks</small>
                    </div>
                  </div>
                </div>
                <div onClick={() => loadReportCard('report-card-program-c')} className="layer bdT p-20 w-100 program-report-card-list">
                  <div className="peers ai-c gapX-20">
                    <div className="peer peer-greed">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Program C</span>
                    </div>
                    <div className="peer">
                      <i className="ti-angle-right" />
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Vocational</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Class instruction</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">24 weeks</small>
                    </div>
                  </div>
                </div>
                <div onClick={() => loadReportCard('report-card-program-d')} className="layer bdT p-20 w-100 program-report-card-list">
                  <div className="peers ai-c gapX-20">
                    <div className="peer peer-greed">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Program D</span>
                    </div>
                    <div className="peer">
                      <i className="ti-angle-right" />
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Vocational</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Class instruction</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Open entry/exit</small>
                    </div>
                  </div>
                </div>
                <div onClick={() => loadReportCard('report-card-program-e')} className="layer bdT p-20 w-100 program-report-card-list">
                  <div className="peers ai-c gapX-20">
                    <div className="peer peer-greed">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Program E</span>
                    </div>
                    <div className="peer">
                      <i className="ti-angle-right" />
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Vocational</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">One-on-one</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Open entry/exit</small>
                    </div>
                  </div>
                </div>
                <div onClick={() => loadReportCard('report-card-program-f')} className="layer bdT p-20 w-100 program-report-card-list">
                  <div className="peers ai-c gapX-20">
                    <div className="peer peer-greed">
                      <span className="fsz-def fw-600 mR-10 c-grey-800">Program F</span>
                    </div>
                    <div className="peer">
                      <i className="ti-angle-right" />
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Treatment</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">One-on-one</small>
                    </div>
                    <div className="peer fw-600">
                      <small className="c-grey-500 fw-600">Open entry/exit</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PROGRAM REPORT CARD TEMPLATE */}
          <div className="masonry-item col-md-6">
            <div className="bd bgc-white">
              <div className="layers">
                <div className="layer w-100 pX-20 pT-20">
                  <h5 id="report-card-title" className="lh-1">{reportCardTitle}</h5>
                </div>
                <div className="layer w-100 p-20">
                  <div className="peers ai-c gapX-20 pB-20">
                    <div className="peer peer-greed">
                      <div id="report-card-description" className="mR-10 c-grey-800">
                        {reportCardDescription}
                      </div>
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Type</small>
                      <span id="report-card-type" className="fsz-def fw-600 mR-10 c-grey-800">{reportCardType}</span>
                    </div>
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Method</small>
                      <span id="report-card-method" className="fsz-def fw-600 mR-10 c-grey-800">{reportCardMethod}</span>
                    </div>
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Dosage</small>
                      <span id="report-card-dosage" className="fsz-def fw-600 mR-10 c-grey-800">{reportCardDosage}</span>
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Completion rate</small>
                      <span id="report-card-completion-rate" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardCompletionRate}</span>
                    </div>
                    <div className="peer">
                      <small className="c-grey-500 fw-600">Cost per person</small>
                      <span id="report-card-cost" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardCost}</span>
                    </div>
                  </div>
                </div>
                <div className="layer w-100 pX-20">
                  <div className="peers ai-c gapX-20 pB-20">
                    <div className="peer peer-greed">
                      <div className="fsz-def fw-600 mR-10 c-grey-800">1-year follow-up rates</div>
                      <small className="c-grey-500 fw-600">Averaged from release cohorts 2010-2017 &gt; Compared to control groups of non-participants</small>
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20">
                    <div className="peer">
                      <div className="layer w-100">
                        <div className="peer">
                          <div className="fsz-def fw-600 mR-10 c-grey-800">Employment</div>
                        </div>
                      </div>
                      <div className="layer w-100 pY-10">
                        <div className="peers ai-c gapX-10 pB-20">
                          <div className="peer">
                            <div id="report-card-employment-1" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardEmployment1}</div>
                            <small className="c-grey-500 fw-600">Participants</small>
                          </div>
                          <div className="peer">
                            <div className="fsz-def fw-600 mR-10 c-grey-800">39%</div>
                            <small className="c-grey-500 fw-600">Non-participants</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="peer">
                      <div className="layer w-100">
                        <div className="peer">
                          <div className="fsz-def fw-600 mR-10 c-grey-800">Reincarceration</div>
                        </div>
                      </div>
                      <div className="layer w-100 pY-10">
                        <div className="peers ai-c gapX-10 pB-20">
                          <div className="peer">
                            <div id="report-card-reincarceration-1" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardReincarceration1}</div>
                            <small className="c-grey-500 fw-600">Participants</small>
                          </div>
                          <div className="peer">
                            <div className="fsz-def fw-600 mR-10 c-grey-800">17.4%</div>
                            <small className="c-grey-500 fw-600">Non-participants</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="peer">
                      <div className="layer w-100">
                        <div className="peer">
                          <div className="fsz-def fw-600 mR-10 c-grey-800">Parole revocation</div>
                        </div>
                      </div>
                      <div className="layer w-100 pY-10">
                        <div className="peers ai-c gapX-10 pB-20">
                          <div className="peer">
                            <div id="report-card-revocation-1" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardRevocation1}</div>
                            <small className="c-grey-500 fw-600">Participants</small>
                          </div>
                          <div className="peer">
                            <div className="fsz-def fw-600 mR-10 c-grey-800">11.0%</div>
                            <small className="c-grey-500 fw-600">Non-participants</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="layer w-100 pX-20">
                  <div className="peers ai-c gapX-20 pB-20">
                    <div className="peer peer-greed">
                      <div className="fsz-def fw-600 mR-10 c-grey-800">3-year follow-up rates</div>
                      <small className="c-grey-500 fw-600">Averaged from release cohorts 2010-2015 &gt; Compared to control groups of non-participants</small>
                    </div>
                  </div>
                  <div className="peers ai-c gapX-20 pB-20">
                    <div className="peer">
                      <div className="layer w-100">
                        <div className="peer">
                          <div className="fsz-def fw-600 mR-10 c-grey-800">Employment</div>
                        </div>
                      </div>
                      <div className="layer w-100 pY-10">
                        <div className="peers ai-c gapX-10 pB-20">
                          <div className="peer">
                            <div id="report-card-employment-3" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardEmployment3}</div>
                            <small className="c-grey-500 fw-600">Participants</small>
                          </div>
                          <div className="peer">
                            <div className="fsz-def fw-600 mR-10 c-grey-800">54%</div>
                            <small className="c-grey-500 fw-600">Non-participants</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="peer">
                      <div className="layer w-100">
                        <div className="peer">
                          <div className="fsz-def fw-600 mR-10 c-grey-800">Reincarceration</div>
                        </div>
                      </div>
                      <div className="layer w-100 pY-10">
                        <div className="peers ai-c gapX-10 pB-20">
                          <div className="peer">
                            <div id="report-card-reincarceration-3" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardReincarceration3}</div>
                            <small className="c-grey-500 fw-600">Participants</small>
                          </div>
                          <div className="peer">
                            <div className="fsz-def fw-600 mR-10 c-grey-800">22.4%</div>
                            <small className="c-grey-500 fw-600">Non-participants</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="peer">
                      <div className="layer w-100">
                        <div className="peer">
                          <div className="fsz-def fw-600 mR-10 c-grey-800">Parole revocation</div>
                        </div>
                      </div>
                      <div className="layer w-100 pY-10">
                        <div className="peers ai-c gapX-10 pB-20">
                          <div className="peer">
                            <div id="report-card-revocation-3" className="fsz-def fw-600 mR-10 c-blue-800">{reportCardRevocation3}</div>
                            <small className="c-grey-500 fw-600">Participants</small>
                          </div>
                          <div className="peer">
                            <div className="fsz-def fw-600 mR-10 c-grey-800">18.7%</div>
                            <small className="c-grey-500 fw-600">Non-participants</small>
                          </div>
                        </div>
                      </div>
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

export default ProgramEvaluation;
