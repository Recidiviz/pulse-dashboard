// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import React, { useState, useEffect, useCallback } from "react";

import PageTemplate from "../PageTemplate";
import Loading from "../../../../components/Loading";
import ChartCard from "../../../../components/charts/ChartCard";
import GeoViewTimeChart from "../../../../components/charts/GeoViewTimeChart";
import MetholodgyCollapse from "../../../../components/charts/MetholodgyCollapse";
import RevocationCountOverTime from "../../../../components/charts/revocations/RevocationCountOverTime";
import LsirScoreChangeSnapshot from "../../../../components/charts/snapshots/LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "../../../../components/charts/snapshots/RevocationAdmissionsSnapshot";
import SupervisionSuccessSnapshot from "../../../../components/charts/snapshots/SupervisionSuccessSnapshot";
// eslint-disable-next-line import/no-cycle
import { useAuth0 } from "../../../../react-auth0-spa";
import {
  callMetricsApi,
  awaitingResults,
} from "../../../../utils/metricsClient";
import logger from "../../../../utils/logger";

const metrics = {
  district: "all",
  metricPeriodMonths: "36",
  supervisionType: "all",
};

const CommunityGoals = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = useCallback(async () => {
    try {
      const responseData = await callMetricsApi(
        "us_nd/community/goals",
        getTokenSilently
      );
      setApiData(responseData);
      setAwaitingApi(false);
    } catch (error) {
      logger.error(error);
    }
  }, [getTokenSilently]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  return (
    <PageTemplate>
      <ChartCard
        chartId="revocationCountsByMonth"
        chartTitle="REVOCATIONS BY MONTH"
        chart={
          <RevocationCountOverTime
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            geoView={false}
            officeData={apiData.site_offices}
            revocationCountsByMonth={apiData.revocations_by_month}
            header="revocationCountsByMonth-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationCountsByMonth"
            chartTitle="REVOCATIONS BY MONTH"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.revocations_by_period}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={
          <MetholodgyCollapse>
            <div>
              <ul>
                <li>
                  Revocations are included based on when the person was admitted
                  to a DOCR facility, not when the violation, offense, or
                  revocation occurred.
                </li>
                <li>
                  When &quot;rate&quot; is selected, the chart shows the percent
                  of the total supervised population incarcerated due to
                  supervision revocation. For the percent of cases closed via
                  revocation, see the &quot;Case terminations by month&quot;
                  chart.
                </li>
                <li>
                  When a supervision type and/or office is selected, the rate is
                  the number of people with revocations who match the selected
                  filters divided by the total number of people on supervision
                  who also match the selected filters.
                </li>
                <li>
                  Revocations are considered probation revocations or parole
                  revocations based on the DOCR admission reason. Because only
                  one reason can be selected, an individual&apos;s revocation
                  will count only towards EITHER parole or probation even if
                  they were on both parole and probation prior to incarceration.
                </li>
                <li>
                  Revocations are attributed to the site of the terminating
                  officer on the revocation in Docstars. Revocation admissions
                  that can&apos;t be matched to a supervision case are not
                  attributed to an office.
                </li>
                <li>
                  Revocations are attributed to the site of the terminating
                  officer at the time of a person&apos;s revocation.
                </li>
              </ul>
            </div>
          </MetholodgyCollapse>
        }
      />

      <ChartCard
        chartId="supervisionSuccessSnapshot"
        chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
        chart={
          <SupervisionSuccessSnapshot
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            supervisionSuccessRates={
              apiData.supervision_termination_by_type_by_month
            }
            header="supervisionSuccessSnapshot-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="supervisionSuccessSnapshot"
            chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={
              apiData.supervision_termination_by_type_by_period
            }
            numeratorKeys={["successful_termination"]}
            denominatorKeys={[
              "revocation_termination",
              "successful_termination",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={
          <MetholodgyCollapse>
            <div>
              <ul>
                <li>
                  A supervision is considered successfully completed if the
                  individual was discharged from supervision positively or if
                  their supervision period expired.
                </li>
                <li>
                  Unsuccessful completions of supervision occur when the
                  supervision ends due to absconsion, a revocation, or a
                  negative termination.
                </li>
                <li>
                  Deaths, suspensions, and &quot;other&quot; terminations are
                  excluded from these calculations because they&apos;re neither
                  &quot;successful&quot; nor &quot;unsuccessful&quot;.
                </li>
                <li>
                  Individuals are counted in their month of projected
                  completion, even if terminated earlier. Individuals who have
                  not yet completed supervision by their projected termination
                  date are excluded.
                </li>
                <li>
                  While on supervision, individuals are attributed to the office
                  of their current supervising officer. Following supervision,
                  individuals are attributed to the office of the officer who
                  terminated their supervision.
                </li>
              </ul>
            </div>
          </MetholodgyCollapse>
        }
      />

      <ChartCard
        chartId="lsirScoreChangeSnapshot"
        chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
        chart={
          <LsirScoreChangeSnapshot
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            lsirScoreChangeByMonth={apiData.average_change_lsir_score_by_month}
            header="lsirScoreChangeSnapshot-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="lsirScoreChangeSnapshot"
            chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.average_change_lsir_score_by_period}
            numeratorKeys={["average_change"]}
            denominatorKeys={[]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={
          <MetholodgyCollapse>
            <div>
              <ul>
                <li>
                  For all individuals ending supervision in a given month who
                  have at least 3 LSI-R assessments (initial assessment, first
                  re-assessment, and terminating assessment), this is the
                  average of the differences between the first reassessment
                  score and the termination assessment score.
                </li>
                <li>
                  Individuals are included regardless of termination reason.
                </li>
                <li>
                  Individuals are linked to the office of their terminating
                  officer.
                </li>
              </ul>
            </div>
          </MetholodgyCollapse>
        }
      />

      <ChartCard
        chartId="revocationAdmissionsSnapshot"
        chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
        chart={
          <RevocationAdmissionsSnapshot
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            revocationAdmissionsByMonth={apiData.admissions_by_type_by_month}
            header="revocationAdmissionsSnapshot-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationAdmissionsSnapshot"
            chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            shareDenominatorAcrossRates
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.admissions_by_type_by_period}
            numeratorKeys={[
              "technicals",
              "non_technicals",
              "unknown_revocations",
            ]}
            denominatorKeys={[
              "technicals",
              "non_technicals",
              "unknown_revocations",
              "new_admissions",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={
          <MetholodgyCollapse>
            <div>
              <ul>
                <li>
                  Prison admissions include individuals who are newly
                  incarcerated in DOCR facilities. Transfers, periods of
                  temporary custody, returns from escape and/or erroneous
                  releases are not considered admissions.
                </li>
                <li>
                  Prison admissions are categorized as probation revocations,
                  parole revocations, or new admissions. New admissions are
                  admissions for a reason other than revocation.
                </li>
                <li>
                  Selecting an office or supervision type narrows down
                  revocations to be revocations from that office and/or
                  supervision type.
                </li>
                <li>
                  &quot;Rate&quot; displays the percent of all admissions that
                  occurred by supervision revocation. When a supervision type
                  and/or office is selected, the chart displays the percent of
                  all admissions that were revocations from that office and/or
                  supervision type.
                </li>
              </ul>
            </div>
          </MetholodgyCollapse>
        }
      />
    </PageTemplate>
  );
};

export default CommunityGoals;
