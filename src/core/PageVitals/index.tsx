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
import { useRootStore } from "../../components/StoreProvider";
import { VitalsSummaryRecord } from "../models/types";
import { getSummaryCards, getSummaryDetail } from "./helpers";

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

const PageVitals: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState(1);
  const { tenantStore } = useRootStore();
  const { stateName } = tenantStore;

  const handleSelectCard: (id: number) => () => void = (id) => () => {
    setSelectedCardId(id);
  };

  const summaryCards = getSummaryCards(mockSummary);
  const summaryDetail = getSummaryDetail(summaryCards, selectedCardId);

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
          <VitalsSummaryDetail summaryDetail={summaryDetail} />
        </div>
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
