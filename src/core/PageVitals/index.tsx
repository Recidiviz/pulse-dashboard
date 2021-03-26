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

const mockSummary: VitalsSummaryRecord = {
  entityId: "1",
  entityName: "North Dakota",
  overall: 90,
  overall7Day: 21,
  overall28Day: 76,
  timelyDischarge: 97,
  timelyFtrEnrollment: 80,
  timelyContacts: 34,
  timelyRiskAssessments: 75,
};

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
    id: 1,
  },
  {
    title: "Timely discharge",
    description: `of clients were discharged at their earliest projected regular
     supervision discharge date`,
    value: summary.timelyDischarge,
    status: getSummaryStatus(summary.timelyDischarge),
    id: 2,
  },
  {
    title: "Timely FTR enrollment",
    description:
      "of clients are not pending enrollment in Free Through Recovery",
    value: summary.timelyFtrEnrollment,
    status: getSummaryStatus(summary.timelyFtrEnrollment),
    id: 3,
  },
  {
    title: "Timely contacts",
    description: `of clients received initial contact within 30 days of starting
     supervision and a F2F contact every subsequent 90, 60, or 30 days for 
     minimum, medium, and maximum supervision levels respectively`,
    value: summary.timelyContacts,
    status: getSummaryStatus(summary.timelyContacts),
    id: 4,
  },
  {
    title: "Timely risk assessments",
    description: `of clients have had an initial assessment within 30 days and 
      reassessment within 212 days`,
    value: summary.timelyRiskAssessments,
    status: getSummaryStatus(summary.timelyRiskAssessments),
    id: 5,
  },
];

function getSummaryDetail(
  summaryCards: SummaryCard[],
  selectedCardId: number
): SummaryCard {
  return (
    summaryCards.find((card) => card.id === selectedCardId) || summaryCards[0]
  );
}

const PageVitals: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState(1);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const timeSeries: VitalsTimeSeriesRecord[] = vitalsTimeSeries(
    apiData.vitals_time_series.data
  );

  // TODO move entity and filtering to a store
  const entity = "STATE_DOC";
  const selectedMetric = "OVERALL";
  const selectedEntitySummary = vitalsSummaries.find(
    (d) => d.entityId === entity && d.parentEntityId === d.entityId
  );
  const selectedEntitySummaries = vitalsSummaries.filter(
    (d) => d.parentEntityId === entity && d.parentEntityId !== d.entityId
  );
  const selectedTimeSeries = timeSeries.filter(
    (d) => d.metric === selectedMetric
  );

  const handleSelectCard: (id: number) => () => void = (id) => () => {
    setSelectedCardId(id);
  };

  const summaryCards =
    selectedEntitySummary && getSummaryCards(selectedEntitySummary);
  const summaryDetail =
    summaryCards && getSummaryDetail(summaryCards, selectedCardId);

  return (
    <PageTemplate>
      <div className="PageVitals__Title">{stateName}</div>
      <div className="PageVitals__SummaryCards">
        <VitalsSummaryCards
          onClick={handleSelectCard}
          selected={selectedCardId}
          summaryCards={getSummaryCards(mockSummary)}
        />
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
        <VitalsSummaryTable summaries={selectedEntitySummaries} />
      </div>
    </PageTemplate>
  );
};

export default observer(PageVitals);
