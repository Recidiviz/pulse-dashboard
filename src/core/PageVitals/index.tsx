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

import "../DetailsGroup.scss";
import "./PageVitals.scss";

import { observer } from "mobx-react-lite";
import React from "react";

import Loading from "../../components/Loading";
import withRouteSync from "../../withRouteSync";
import { useCoreStore } from "../CoreStoreProvider";
import DetailsGroup from "../DetailsGroup";
import DownloadDataButton from "../DownloadDataButton";
import MethodologyLink from "../MethodologyLink";
import { ENTITY_TYPES } from "../models/types";
import PageTemplate from "../PageTemplate";
import { CORE_PATHS } from "../views";
import VitalsCaseloadButton from "../VitalsCaseloadButton";
import VitalsMonthlyChange from "../VitalsMonthlyChange";
import VitalsSummaryBreadcrumbs from "../VitalsSummaryBreadcrumbs";
import VitalsSummaryCards from "../VitalsSummaryCards";
import VitalsSummaryChart from "../VitalsSummaryChart";
import VitalsSummaryDetail from "../VitalsSummaryDetail";
import VitalsSummaryTable from "../VitalsSummaryTable/VitalsSummaryTable";

const PageVitals: React.FC = () => {
  const { metricsStore, pageVitalsStore } = useCoreStore();
  const { isLoading, isError } = metricsStore.vitals;
  const { currentEntitySummary, lastUpdatedOn, downloadData } = pageVitalsStore;

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

  return (
    <PageTemplate>
      <div className="PageVitals__header">
        <VitalsSummaryBreadcrumbs />
        <DetailsGroup>
          <div className="DetailsGroup__item">
            Last updated on {lastUpdatedOn}
          </div>
          <DownloadDataButton handleOnClick={downloadData} />
          <MethodologyLink path={CORE_PATHS.methodologyVitals} />
        </DetailsGroup>
      </div>
      <div className="PageVitals__SummaryCards">
        <VitalsSummaryCards />
      </div>
      <div className="PageVitals__SummarySection">
        <div className="PageVitals__SummaryDetail">
          <VitalsSummaryDetail />
        </div>
        <div className="PageVitals__SummaryChart">
          <VitalsMonthlyChange />
          <VitalsSummaryChart />
        </div>
      </div>
      <div className="PageVitals__CaseloadButton">
        <VitalsCaseloadButton />
      </div>
      <div className="PageVitals__Table">
        {currentEntitySummary.entityType !== ENTITY_TYPES.PO && (
          <VitalsSummaryTable />
        )}
      </div>
    </PageTemplate>
  );
};

export default withRouteSync(observer(PageVitals));
