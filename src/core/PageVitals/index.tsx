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
import {
  getSummaryCards,
  getSummaryDetail,
  getEntitySummaries,
  getTimeseries,
  getWeeklyChange,
} from "./helpers";
import "./PageVitals.scss";

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
  const selectedTimeSeries = getTimeseries(timeSeries, selectedCardId);

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
          <VitalsSummaryDetail
            summaryDetail={getSummaryDetail(summaryCards, selectedCardId)}
          />
        </div>
        <div className="PageVitals__SummaryChart">
          <VitalsWeeklyChange
            weeklyChange={getWeeklyChange(selectedTimeSeries)}
          />
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
