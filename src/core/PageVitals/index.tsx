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
import VitalsSummaryChart from "../VitalsSummaryChart";
import { useRootStore } from "../../components/StoreProvider";
import "./PageVitals.scss";

const PageVitals: React.FC = () => {
  const { tenantStore } = useRootStore();
  const { stateName } = tenantStore;

  return (
    <PageTemplate>
      <div className="PageVitals__Title">{stateName}</div>
      <div className="PageVitals__SummaryCards">
        <VitalsSummaryCards />
      </div>
      <div className="PageVitals__SummarySection">
        <div className="PageVitals__SummaryDetail">79%</div>
        <div className="PageVitals__SummaryChart">
          <VitalsSummaryChart />
        </div>
      </div>
      <div className="PageVitals__Table">
        <VitalsSummaryTable />
      </div>
    </PageTemplate>
  );
};

export default observer(PageVitals);
