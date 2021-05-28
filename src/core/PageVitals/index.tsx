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
import { observer } from "mobx-react-lite";
import PageTemplate from "../PageTemplate";
import VitalsSummaryCards from "../VitalsSummaryCards";
import VitalsSummaryTable from "../VitalsSummaryTable/VitalsSummaryTable";
import VitalsMonthlyChange from "../VitalsMonthlyChange";
import VitalsSummaryChart from "../VitalsSummaryChart";
import VitalsSummaryDetail from "../VitalsSummaryDetail";
import VitalsSummaryBreadcrumbs from "../VitalsSummaryBreadcrumbs";
import MethodologyLink from "../MethodologyLink";
import Loading from "../../components/Loading";
import { CORE_PATHS } from "../views";
import { useCoreStore } from "../CoreStoreProvider";
import DownloadDataButton from "../DownloadDataButton";
import DetailsGroup from "../DetailsGroup";
import { ENTITY_TYPES } from "../models/types";
import { MetricType, METRIC_TYPES } from "./types";
import content from "../content";
import withRouteSync from "../../withRouteSync";

import "../DetailsGroup.scss";
import "./PageVitals.scss";

const goals = {
  [METRIC_TYPES.OVERALL]: 80,
  [METRIC_TYPES.DISCHARGE]: 90,
  [METRIC_TYPES.CONTACT]: 80,
  [METRIC_TYPES.RISK_ASSESSMENT]: 85,
};

const PageVitals: React.FC = () => {
  const { metricsStore, tenantStore, vitalsPageStore } = useCoreStore();
  const { isLoading, isError } = metricsStore.vitals;
  const {
    currentEntitySummary,
    childEntitySummaryRows,
    parentEntityName,
    summaryCards,
    vitalsFiltersText,
    selectedMetricId,
    selectedMetricTimeSeries,
    lastUpdatedOn,
    timeSeriesDownloadableData,
    vitalsSummaryDownloadableData,
    monthlyChange,
    summaryDetail,
  } = vitalsPageStore;
  const { stateName, stateCode, currentTenantId } = tenantStore;

  // @ts-ignore TODO TS
  const { vitals: vitalsMethodology } = content[currentTenantId];

  // TODO: add in Error state
  if (isError || currentEntitySummary === undefined) {
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
    vitalsPageStore.setSelectedMetricId(id);
  };

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
            data={[timeSeriesDownloadableData, vitalsSummaryDownloadableData]}
            title={`${stateName} At A Glance`}
            methodology={vitalsMethodology.content}
            filters={vitalsFiltersText}
            lastUpdatedOn={lastUpdatedOn}
          />
          <MethodologyLink path={CORE_PATHS.methodologyVitals} />
        </DetailsGroup>
      </div>
      <div className="PageVitals__SummaryCards">
        <VitalsSummaryCards
          onClick={handleSelectCard}
          selected={selectedMetricId}
          summaryCards={summaryCards}
        />
      </div>
      <div className="PageVitals__SummarySection">
        <div className="PageVitals__SummaryDetail">
          <VitalsSummaryDetail summaryDetail={summaryDetail} />
        </div>
        <div className="PageVitals__SummaryChart">
          {selectedMetricTimeSeries && (
            <>
              {monthlyChange && (
                <VitalsMonthlyChange monthlyChange={monthlyChange} />
              )}
              <VitalsSummaryChart
                stateCode={stateCode}
                goal={goals[selectedMetricId]}
                timeSeries={selectedMetricTimeSeries.slice(-180)}
              />
            </>
          )}
        </div>
      </div>
      <div className="PageVitals__Table">
        {currentEntitySummary.entityType !== ENTITY_TYPES.PO && (
          <VitalsSummaryTable
            selectedSortBy={selectedMetricId}
            summaries={childEntitySummaryRows}
          />
        )}
      </div>
    </PageTemplate>
  );
};

export default withRouteSync(observer(PageVitals));
