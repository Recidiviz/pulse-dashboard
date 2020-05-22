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
import DaysAtLibertySnapshot from "../../../../components/charts/snapshots/DaysAtLibertySnapshot";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";
import ReincarcerationCountOverTime from "../../../../components/charts/reincarcerations/ReincarcerationCountOverTime";

const metrics = {
  district: "all",
  metricPeriodMonths: "36",
  supervisionType: "all",
};

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
            daysAtLibertyByMonth={apiData.avg_days_at_liberty_by_month}
            header="daysAtLibertySnapshot-header"
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
            reincarcerationCountsByMonth={apiData.reincarcerations_by_month}
            header="reincarcerationCountsByMonth-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="reincarcerationCountsByMonth"
            chartTitle="REINCARCERATIONS BY MONTH"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            keyedByOffice={false}
            stateCode="us_nd"
            dataPointsByOffice={apiData.reincarcerations_by_period}
            numeratorKeys={["returns"]}
            denominatorKeys={["total_admissions"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="reincarcerationCountsByMonth" />}
      />
    </PageTemplate>
  );
};

export default FacilitiesGoals;
