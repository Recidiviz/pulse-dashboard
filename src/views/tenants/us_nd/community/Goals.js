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

import React from "react";

import PageTemplate from "../PageTemplate";
import Loading from "../../../../components/Loading";
import ChartCard from "../../../../components/charts/ChartCard";
import GeoViewTimeChart from "../../../../components/charts/GeoViewTimeChart";
import Methodology from "../../../../components/charts/Methodology";
import PeriodLabel from "../../../../components/charts/PeriodLabel";
import LsirScoreChangeSnapshot from "../../../../components/charts/community/LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "../../../../components/charts/community/RevocationAdmissionsSnapshot";
import RevocationCountOverTime from "../../../../components/charts/community/RevocationCountOverTime";
import SupervisionSuccessSnapshot from "../../../../components/charts/community/SupervisionSuccessSnapshot";
import useChartData from "../../../../hooks/useChartData";
import { metrics } from "./constants";

const CommunityGoals = () => {
  const { apiData, isLoading, getTokenSilently } = useChartData(
    "us_nd/community/goals"
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageTemplate>
      <ChartCard
        chartId="revocationCountsByMonth"
        chartTitle="REVOCATION ADMISSIONS BY MONTH"
        chart={
          <RevocationCountOverTime
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            officeData={apiData.site_offices.data}
            revocationCountsByMonth={apiData.revocations_by_month.data}
            header="revocationCountsByMonth-header"
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationCountsByMonth"
            chartTitle="REVOCATION ADMISSIONS BY MONTH"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices.data}
            dataPointsByOffice={apiData.revocations_by_period.data}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="revocationCountsByMonthGoal" />}
        geoFooter={
          <>
            <Methodology chartId="revocationCountsByMonthGoal" />
            <PeriodLabel metricPeriodMonths={metrics.metricPeriodMonths} />
          </>
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
              apiData.supervision_termination_by_type_by_month.data
            }
            header="supervisionSuccessSnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={
              apiData.supervision_termination_by_type_by_period.data
            }
            numeratorKeys={["successful_termination"]}
            denominatorKeys={[
              "revocation_termination",
              "successful_termination",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="supervisionSuccessSnapshot" />}
        geoFooter={
          <>
            <Methodology chartId="supervisionSuccessSnapshot" />
            <PeriodLabel metricPeriodMonths={metrics.metricPeriodMonths} />
          </>
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
            lsirScoreChangeByMonth={
              apiData.average_change_lsir_score_by_month.data
            }
            header="lsirScoreChangeSnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
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
            possibleNegativeValues
            officeData={apiData.site_offices.data}
            dataPointsByOffice={
              apiData.average_change_lsir_score_by_period.data
            }
            numeratorKeys={["average_change"]}
            denominatorKeys={[]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="lsirScoreChangeSnapshot" />}
        geoFooter={
          <>
            <Methodology chartId="lsirScoreChangeSnapshot" />
            <PeriodLabel metricPeriodMonths={metrics.metricPeriodMonths} />
          </>
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
            revocationAdmissionsByMonth={
              apiData.admissions_by_type_by_month.data
            }
            header="revocationAdmissionsSnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={apiData.admissions_by_type_by_period.data}
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
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="revocationAdmissionsSnapshotGoal" />}
        geoFooter={
          <>
            <Methodology chartId="revocationAdmissionsSnapshotGoal" />
            <PeriodLabel metricPeriodMonths={metrics.metricPeriodMonths} />
          </>
        }
      />
    </PageTemplate>
  );
};

export default CommunityGoals;
