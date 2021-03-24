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

import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import PageTemplate from "../PageTemplate";
import VitalsSummaryCards from "../VitalsSummaryCards";
import VitalsSummaryTable from "../VitalsSummaryTable/VitalsSummaryTable";
import { useRootStore } from "../../components/StoreProvider";
import { ChartDataType } from "../types/charts";
import useChartData from "../hooks/useChartData";
import { VitalsEntityRecord } from "../models/types";
import { vitalsEntity } from "../models/VitalsEntityMetric";
import Loading from "../../components/Loading";
import "./PageVitals.scss";

const PageVitals: React.FC = () => {
  const { tenantStore } = useRootStore();
  const { stateName } = tenantStore;
  const { isLoading, isError, apiData }: ChartDataType = useChartData(
    "us_nd/vitals/summary"
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
  const vitalsEntities: VitalsEntityRecord[] = vitalsEntity(
    apiData.vitals_entities.data
  );

  // TODO move entity and filtering to a store
  const entity = "US_ND";
  const vitalsSummary = vitalsEntities.find(
    (d) => d.entity === entity && d.parentEntity === d.entity
  );
  const vitalsSummaries = vitalsEntities.filter(
    (d) => d.parentEntity === entity && d.parentEntity !== d.entity
  );

  return (
    <PageTemplate>
      <div className="PageVitals__Title">{stateName}</div>
      <div className="PageVitals__SummaryCards">
        <VitalsSummaryCards vitalsSummary={vitalsSummary} />
      </div>
      <div className="PageVitals__Table">
        <VitalsSummaryTable vitalsSummaries={vitalsSummaries} />
      </div>
    </PageTemplate>
  );
};

export default observer(PageVitals);
