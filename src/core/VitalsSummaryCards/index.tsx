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

import groupBy from "lodash/groupBy";
import get from "lodash/get";

import { VitalsEntityRecord } from "../models/types";
import VitalsSummaryCard from "./VitalsSummaryCard";
import { SummaryCard } from "./types";

const mockCardContent: SummaryCard[] = [
  {
    title: "Overall",
    percent: 79,
    status: "NEEDS_IMPROVEMENT",
    id: 1,
  },
  {
    title: "Program availability",
    percent: 56,
    status: "POOR",
    id: 2,
  },
  {
    title: "Timely contacts",
    percent: 100,
    status: "EXCELLENT",
    id: 3,
  },
  {
    title: "Timely risk assessments",
    percent: 94,
    status: "GREAT",
    id: 4,
  },
  {
    title: "Timely discharge",
    percent: 79,
    status: "GOOD",
    id: 5,
  },
];

type PropTypes = {
  vitalsSummary?: VitalsEntityRecord;
};

const VitalsSummaryCards: React.FC<PropTypes> = ({ vitalsSummary }) => {
  const [selectCard, setSelectCard] = useState(1);

  const handleSelectCard: (id: number) => () => void = (id) => () => {
    setSelectCard(id);
  };
  const groupingCard = groupBy(mockCardContent, "status");
  const orderedCard = [
    ...get(groupingCard, "NEEDS_IMPROVEMENT", []),
    ...get(groupingCard, "POOR", []),
    ...get(groupingCard, "GOOD", []),
    ...get(groupingCard, "GREAT", []),
    ...get(groupingCard, "EXCELLENT", []),
  ];

  return (
    <>
      {orderedCard.map(({ title, percent, status, id }) => (
        <VitalsSummaryCard
          key={id}
          title={title}
          percentage={percent}
          status={status}
          selected={selectCard === id}
          onClick={handleSelectCard(id)}
        />
      ))}
    </>
  );
};

export default VitalsSummaryCards;
