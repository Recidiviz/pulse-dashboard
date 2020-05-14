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
// eslint-disable-next-line import/no-cycle
import { useAuth0 } from "../../../../react-auth0-spa";
import {
  callMetricsApi,
  awaitingResults,
} from "../../../../utils/metricsClient";
import logger from "../../../../utils/logger";

const CommunityGoals = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const fetchChartData = useCallback(async () => {
    try {
      const responseData = await callMetricsApi(
        "us_nd/revocations",
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
            metricType="count"
            metricPeriodMonths="12"
            supervisionType="all"
            district="all"
            geoView={false}
            officeData={apiData.site_offices}
            revocationCountsByMonth={apiData.revocations_by_month}
            header="revocationCountsByMonth-header"
          />
        }
        mapChart={
          <GeoViewTimeChart
            chartId="revocationCountsByMonth"
            chartTitle="REVOCATIONS BY MONTH"
            metricType="count"
            metricPeriodMonths="12"
            supervisionType="all"
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
          <MetholodgyCollapse chartId="revocationCountsByMonth">
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
    </PageTemplate>
  );
};

export default CommunityGoals;
