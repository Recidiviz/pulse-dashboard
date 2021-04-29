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
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import PageTemplate from "../PageTemplate";
import VitalsSummaryCards from "../VitalsSummaryCards";
import VitalsSummaryTable from "../VitalsSummaryTable/VitalsSummaryTable";
import VitalsWeeklyChange from "../VitalsWeeklyChange";
import VitalsSummaryChart from "../VitalsSummaryChart";
import VitalsSummaryDetail from "../VitalsSummaryDetail";
import VitalsSummaryBreadcrumbs from "../VitalsSummaryBreadcrumbs";
import MethodologyLink from "../MethodologyLink";
import Loading from "../../components/Loading";
import { MetricType, METRIC_TYPES } from "./types";
import { CORE_PATHS } from "../views";
import { useCoreStore } from "../CoreStoreProvider";
import { convertSlugToId } from "../../utils/navigation";
import { formatISODateString } from "../../utils/formatStrings";
import {
  getSummaryCards,
  getSummaryDetail,
  getEntitySummaries,
  getTimeSeries,
  getWeeklyChange,
  getTimeSeriesDownloadableData,
  getVitalsSummaryDownloadableData,
} from "./helpers";
import DownloadDataButton from "../DownloadDataButton";
import DetailsGroup from "../DetailsGroup";
import { ENTITY_TYPES } from "../models/types";
import "../DetailsGroup.scss";
import "./PageVitals.scss";

const DEFAULT_ENTITY_ID = "STATE_DOC";
const goals = {
  [METRIC_TYPES.OVERALL]: 80,
  [METRIC_TYPES.DISCHARGE]: 90,
  [METRIC_TYPES.FTR_ENROLLMENT]: 70,
  [METRIC_TYPES.CONTACT]: 80,
  [METRIC_TYPES.RISK_ASSESSMENT]: 85,
};

const PageVitals: React.FC = () => {
  const routeParams = useParams() as { entityId: string | undefined };
  const currentEntityId = routeParams.entityId
    ? convertSlugToId(routeParams.entityId)
    : DEFAULT_ENTITY_ID;
  const { metricsStore, tenantStore } = useCoreStore();

  const { summaries, timeSeries, isLoading, isError } = metricsStore.vitals;

  const { stateName, stateCode } = tenantStore;
  const [selectedCardId, setSelectedCardId] = useState<MetricType>(
    METRIC_TYPES.OVERALL
  );

  // TODO: add in Error state
  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <PageTemplate>
        <Loading />
      </PageTemplate>
    );
  }

  const handleSelectCard: (id: MetricType) => () => void = (id) => () => {
    setSelectedCardId(id);
  };

  const {
    currentEntitySummary,
    childEntitySummaryRows,
    parentEntityName,
  } = getEntitySummaries(summaries, currentEntityId);
  const summaryCards = getSummaryCards(currentEntitySummary);
  const selectedTimeSeries = getTimeSeries(
    timeSeries,
    currentEntityId,
    selectedCardId
  );

  const lastUpdatedOn = selectedTimeSeries
    ? formatISODateString(
        selectedTimeSeries[selectedTimeSeries.length - 1].date
      )
    : "Unknown";

  return (
    <PageTemplate>
      <div className="PageVitals__header">
        <VitalsSummaryBreadcrumbs
          stateName={stateName}
          entity={currentEntitySummary}
          parentEntityName={parentEntityName}
        />
        <DetailsGroup>
          <div className="DetailsGroup__item">
            Last updated on {lastUpdatedOn}
          </div>
          <DownloadDataButton
            data={[
              getTimeSeriesDownloadableData(
                getTimeSeries(timeSeries, currentEntityId)
              ),
              getVitalsSummaryDownloadableData(childEntitySummaryRows),
            ]}
            title={`${stateName} At A Glance`}
          />
          <MethodologyLink path={CORE_PATHS.methodologyVitals} />
        </DetailsGroup>
      </div>
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
          {selectedTimeSeries && (
            <>
              <VitalsWeeklyChange
                weeklyChange={getWeeklyChange(selectedTimeSeries)}
              />
              <VitalsSummaryChart
                stateCode={stateCode}
                goal={goals[selectedCardId]}
                timeSeries={selectedTimeSeries}
              />
            </>
          )}
        </div>
      </div>
      <div className="PageVitals__Table">
        {currentEntitySummary.entityType !== ENTITY_TYPES.PO && (
          <VitalsSummaryTable
            selectedSortBy={selectedCardId}
            summaries={childEntitySummaryRows}
          />
        )}
      </div>
    </PageTemplate>
  );
};

export default observer(PageVitals);
