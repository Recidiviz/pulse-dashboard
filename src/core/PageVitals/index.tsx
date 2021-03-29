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

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import PageTemplate from "../PageTemplate";
import VitalsSummaryCards from "../VitalsSummaryCards";
import VitalsSummaryTable from "../VitalsSummaryTable/VitalsSummaryTable";
import VitalsWeeklyChange from "../VitalsWeeklyChange";
import VitalsSummaryChart from "../VitalsSummaryChart";
import VitalsSummaryDetail from "../VitalsSummaryDetail";
import Loading from "../../components/Loading";
import { useRootStore } from "../../components/StoreProvider";
import { VitalsSummaryRecord, VitalsTimeSeriesRecord } from "../models/types";
import { ChartDataType } from "../types/charts";
import useChartData from "../hooks/useChartData";
import { vitalsTimeSeries } from "../models/VitalsTimeSeriesMetric";
import { vitalsSummary } from "../models/VitalsSummaryMetric";
import { getSummaryCards, getSummaryDetail } from "./helpers";
import "./PageVitals.scss";

function getTimeseries(
  timeSeries: VitalsTimeSeriesRecord[],
  selectedCardId: string
) {
  return timeSeries.filter((d) => d.metric === selectedCardId);
}

function getEntitySummaries(
  vitalsSummaries: VitalsSummaryRecord[],
  currentEntity: string
): {
  parentEntitySummary: VitalsSummaryRecord;
  childEntitySummaries: VitalsSummaryRecord[];
} {
  const parentEntitySummary = vitalsSummaries.find(
    (d) => d.entityId === currentEntity && d.parentEntityId === d.entityId
  ) as VitalsSummaryRecord;
  const childEntitySummaries = vitalsSummaries.filter(
    (d) => d.parentEntityId === currentEntity && d.parentEntityId !== d.entityId
  ) as VitalsSummaryRecord[];
  return { parentEntitySummary, childEntitySummaries };
}

const PageVitals: React.FC = () => {
  const { tenantStore } = useRootStore();
  const { stateName } = tenantStore;
  const [selectedCardId, setSelectedCardId] = useState("OVERALL");
  const [currentEntity] = useState("STATE_DOC");
  const { isLoading, isError, apiData }: ChartDataType = useChartData(
    "us_nd/vitals"
  ) as ChartDataType;

  // TODO: add in Error state
  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <PageTemplate>
        <Loading />;
      </PageTemplate>
    );
  }

  // Transform records
  const vitalsSummaries: VitalsSummaryRecord[] = vitalsSummary(
    apiData.vitals_summaries.data
  );
  const timeSeries: VitalsTimeSeriesRecord[] = vitalsTimeSeries(
    apiData.vitals_time_series.data
  );

  const handleSelectCard: (id: string) => () => void = (id) => () => {
    setSelectedCardId(id);
  };

  const { parentEntitySummary, childEntitySummaries } = getEntitySummaries(
    vitalsSummaries,
    currentEntity
  );
  const summaryCards = getSummaryCards(parentEntitySummary);
  const summaryDetail = getSummaryDetail(summaryCards, selectedCardId);
  const selectedTimeSeries = getTimeseries(timeSeries, selectedCardId);
  const twentyEightDaysAgo = selectedTimeSeries[0];
  const sevenDaysAgo = selectedTimeSeries[selectedTimeSeries.length - 8];
  const latestDay = selectedTimeSeries[selectedTimeSeries.length - 1];
  const sevenDayChange = latestDay.weeklyAvg - sevenDaysAgo.weeklyAvg;
  const twentyEightDayChange =
    latestDay.weeklyAvg - twentyEightDaysAgo.weeklyAvg;
  const weeklyChange = { sevenDayChange, twentyEightDayChange };

  return (
    <PageTemplate>
      <div className="PageVitals__Title">{stateName}</div>
      <div className="PageVitals__SummaryCards">
        <VitalsSummaryCards
          onClick={handleSelectCard}
          selected={selectedCardId}
          summaryCards={summaryCards}
        />
      </div>
      <div className="PageVitals__SummarySection">
        <div className="PageVitals__SummaryDetail">
          <VitalsSummaryDetail summaryDetail={summaryDetail} />
        </div>
        <div className="PageVitals__SummaryChart">
          <VitalsWeeklyChange data={weeklyChange} />
          <VitalsSummaryChart timeSeries={selectedTimeSeries} />
        </div>
      </div>
      <div className="PageVitals__Table">
        <VitalsSummaryTable summaries={childEntitySummaries} />
      </div>
    </PageTemplate>
  );
};

export default observer(PageVitals);
