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
import Loading from "../../components/Loading";
import ChartCard from "../ChartCard";
import GeoViewTimeChart from "../GeoViewTimeChart";
import Methodology from "../Methodology";
import PeriodLabel from "../PeriodLabel";
import DaysAtLibertySnapshot from "./DaysAtLibertySnapshot";
import ReincarcerationCountOverTime from "./ReincarcerationCountOverTime";
import useChartData from "../hooks/useChartData";
import { metrics } from "./constants";

const FacilitiesGoals = () => {
  const { apiData, isLoading } = useChartData("us_nd/facilities/goals");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageTemplate>
      <ChartCard
        chartId="daysAtLibertySnapshot"
        chartTitle="DAYS AT LIBERTY (AVERAGE)"
        chart={
          <DaysAtLibertySnapshot
            metricPeriodMonths={metrics.metricPeriodMonths}
            daysAtLibertyByMonth={apiData.avg_days_at_liberty_by_month.data}
            header="daysAtLibertySnapshot-header"
            stateCode="US_ND"
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
              apiData.reincarcerations_by_month.data
            }
            header="reincarcerationCountsByMonth-header"
            stateCode="US_ND"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="reincarcerationCountsByMonth"
            chartTitle="REINCARCERATIONS BY MONTH"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            stateCode="us_nd"
            dataPointsByOffice={apiData.reincarcerations_by_period.data}
            numeratorKeys={["returns"]}
            denominatorKeys={["total_admissions"]}
            centerLat={47.3}
            centerLong={-100.5}
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

export default FacilitiesGoals;
