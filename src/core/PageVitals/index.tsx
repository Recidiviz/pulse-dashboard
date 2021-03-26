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
import VitalsSummaryChart from "../VitalsSummaryChart";
import VitalsSummaryDetail from "../VitalsSummaryDetail";
import Loading from "../../components/Loading";
import { useRootStore } from "../../components/StoreProvider";
import { SummaryCard, SummaryStatus } from "./types";
import { VitalsSummaryRecord, VitalsTimeSeriesRecord } from "../models/types";
import { ChartDataType } from "../types/charts";
import useChartData from "../hooks/useChartData";
import { vitalsTimeSeries } from "../models/VitalsTimeSeriesMetric";
import { vitalsSummary } from "../models/VitalsSummaryMetric";

import "./PageVitals.scss";

function getSummaryStatus(value: number): SummaryStatus {
  if (value < 70) return "POOR";
  if (value >= 70 && value < 80) return "NEEDS_IMPROVEMENT";
  if (value >= 80 && value < 90) return "GOOD";
  if (value >= 90 && value < 95) return "GREAT";
  return "EXCELLENT";
}
const getSummaryCards: (summary: VitalsSummaryRecord) => SummaryCard[] = (
  summary
) => [
  {
    title: "Overall",
    description: "Average timeliness across all metrics",
    value: summary.overall,
    status: getSummaryStatus(summary.overall),
    id: "OVERALL",
  },
  {
    title: "Timely discharge",
    description: `of clients were discharged at their earliest projected regular
     supervision discharge date`,
    value: summary.timelyDischarge,
    status: getSummaryStatus(summary.timelyDischarge),
    id: "DISCHARGE",
  },
  {
    title: "Timely FTR enrollment",
    description:
      "of clients are not pending enrollment in Free Through Recovery",
    value: summary.timelyFtrEnrollment,
    status: getSummaryStatus(summary.timelyFtrEnrollment),
    id: "FTR_ENROLLMENT",
  },
  {
    title: "Timely contacts",
    description: `of clients received initial contact within 30 days of starting
     supervision and a F2F contact every subsequent 90, 60, or 30 days for 
     minimum, medium, and maximum supervision levels respectively`,
    value: summary.timelyContacts,
    status: getSummaryStatus(summary.timelyContacts),
    id: "CONTACTS",
  },
  {
    title: "Timely risk assessments",
    description: `of clients have had an initial assessment within 30 days and 
      reassessment within 212 days`,
    value: summary.timelyRiskAssessments,
    status: getSummaryStatus(summary.timelyRiskAssessments),
    id: "RISK_ASSESSMENTS",
  },
];

function getSummaryDetail(
  summaryCards: SummaryCard[],
  selectedCardId: string
): SummaryCard {
  return (
    summaryCards.find((card) => card.id === selectedCardId) || summaryCards[0]
  );
}

function getTimeseries(
  timeSeries: VitalsTimeSeriesRecord[],
  selectedCardId: string
) {
  return timeSeries.filter((d) => d.metric === selectedCardId);
}

function getEntitySummaries(
  vitalsSummaries: VitalsSummaryRecord[],
  currentEntity: string
) {
  const parentEntitySummary = vitalsSummaries.find(
    (d) => d.entityId === currentEntity && d.parentEntityId === d.entityId
  );
  const childEntitySummaries = vitalsSummaries.filter(
    (d) => d.parentEntityId === currentEntity && d.parentEntityId !== d.entityId
  );
  return { parentEntitySummary, childEntitySummaries };
}

const PageVitals: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState("OVERALL");
  const [currentEntity] = useState("STATE_DOC");
  const { tenantStore } = useRootStore();
  const { stateName } = tenantStore;
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
  const summaryCards =
    parentEntitySummary && getSummaryCards(parentEntitySummary);
  const summaryDetail =
    summaryCards && getSummaryDetail(summaryCards, selectedCardId);
  const selectedTimeSeries = getTimeseries(timeSeries, selectedCardId);

  return (
    <PageTemplate>
      <div className="PageVitals__Title">{stateName}</div>
      <div className="PageVitals__SummaryCards">
        {summaryCards && (
          <VitalsSummaryCards
            onClick={handleSelectCard}
            selected={selectedCardId}
            summaryCards={summaryCards}
          />
        )}
      </div>
      <div className="PageVitals__SummarySection">
        <div className="PageVitals__SummaryDetail">
          {summaryDetail && (
            <VitalsSummaryDetail summaryDetail={summaryDetail} />
          )}
        </div>
        <div className="PageVitals__SummaryChart">
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
