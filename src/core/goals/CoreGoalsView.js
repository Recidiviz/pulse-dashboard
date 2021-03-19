// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import Loading from "../../components/Loading";
import ChartCard from "../ChartCard";
import GeoViewTimeChart from "../GeoViewTimeChart";
import Methodology from "../Methodology";
import PeriodLabel from "../PeriodLabel";
import LsirScoreChangeSnapshot from "./LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "./RevocationAdmissionsSnapshot";
import RevocationCountOverTime from "./RevocationCountOverTime";
import SupervisionSuccessSnapshot from "./SupervisionSuccessSnapshot";
import useChartData from "../hooks/useChartData";
import { metrics } from "../community/constants";
import DaysAtLibertySnapshot from "./DaysAtLibertySnapshot";
import ReincarcerationCountOverTime from "./ReincarcerationCountOverTime";

const CoreGoalsView = () => {
  // TODO(#916): Consolidate API
  const {
    apiData: facilitiesApiData,
    isLoading: facilitiesIsLoading,
    getTokenSilently: getFacilitiesTokenSilently,
  } = useChartData("us_nd/facilities/goals");

  const {
    apiData: communityApiData,
    isLoading: communityIsLoading,
    getTokenSilently: getCommunityTokenSilently,
  } = useChartData("us_nd/community/goals");

  if (facilitiesIsLoading || communityIsLoading) {
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
            officeData={communityApiData.site_offices.data}
            revocationCountsByMonth={communityApiData.revocations_by_month.data}
            header="revocationCountsByMonth-header"
            stateCode="US_ND"
            getTokenSilently={getCommunityTokenSilently}
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
            officeData={communityApiData.site_offices.data}
            dataPointsByOffice={communityApiData.revocations_by_period.data}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getCommunityTokenSilently}
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
              communityApiData.supervision_termination_by_type_by_month.data
            }
            header="supervisionSuccessSnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getCommunityTokenSilently}
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
            officeData={communityApiData.site_offices.data}
            dataPointsByOffice={
              communityApiData.supervision_termination_by_type_by_period.data
            }
            numeratorKeys={["successful_termination"]}
            denominatorKeys={[
              "revocation_termination",
              "successful_termination",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getCommunityTokenSilently}
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
              communityApiData.average_change_lsir_score_by_month.data
            }
            header="lsirScoreChangeSnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getCommunityTokenSilently}
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
            officeData={communityApiData.site_offices.data}
            dataPointsByOffice={
              communityApiData.average_change_lsir_score_by_period.data
            }
            numeratorKeys={["average_change"]}
            denominatorKeys={[]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getCommunityTokenSilently}
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
              communityApiData.admissions_by_type_by_month.data
            }
            header="revocationAdmissionsSnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getCommunityTokenSilently}
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
            officeData={communityApiData.site_offices.data}
            dataPointsByOffice={
              communityApiData.admissions_by_type_by_period.data
            }
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
            getTokenSilently={getCommunityTokenSilently}
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
      <ChartCard
        chartId="daysAtLibertySnapshot"
        chartTitle="DAYS AT LIBERTY (AVERAGE)"
        chart={
          <DaysAtLibertySnapshot
            metricPeriodMonths={metrics.metricPeriodMonths}
            daysAtLibertyByMonth={
              facilitiesApiData.avg_days_at_liberty_by_month.data
            }
            header="daysAtLibertySnapshot-header"
            stateCode="US_ND"
            getTokenSilently={getFacilitiesTokenSilently}
          />
        }
        footer={<Methodology chartId="daysAtLibertySnapshot" />}
      />

      <ChartCard
        chartId="reincarcerationCountsByMonth"
        chartTitle="REINCARCERATIONS BY MONTH"
        chart={
          <ReincarcerationCountOverTime
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            district={metrics.district}
            reincarcerationCountsByMonth={
              facilitiesApiData.reincarcerations_by_month.data
            }
            header="reincarcerationCountsByMonth-header"
            stateCode="US_ND"
            getTokenSilently={getFacilitiesTokenSilently}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="reincarcerationCountsByMonth"
            chartTitle="REINCARCERATIONS BY MONTH"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            stateCode="us_nd"
            dataPointsByOffice={
              facilitiesApiData.reincarcerations_by_period.data
            }
            numeratorKeys={["returns"]}
            denominatorKeys={["total_admissions"]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getFacilitiesTokenSilently}
          />
        }
        footer={<Methodology chartId="reincarcerationCountsByMonthGoal" />}
        geoFooter={
          <>
            <Methodology chartId="reincarcerationCountsByMonthGoal" />
            <PeriodLabel metricPeriodMonths={metrics.metricPeriodMonths} />
          </>
        }
      />
    </PageTemplate>
  );
};

export default CoreGoalsView;
