import React, { useState } from "react";

import groupBy from "lodash/groupBy";
import get from "lodash/get";

import { mockCardContent } from "./constants";
import CoreVitalSummaryCard from "./CoreVitalSummaryCard";

const BlockVitalCards = () => {
  const [selectCard, setSelectCard] = useState(1);

  const handlerSelectedCards = (id) => {
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
    <div className="CoreCommunityVitals__card-container row">
      {orderedCard.map(({ title, percent, status, id }) => (
        <CoreVitalSummaryCard
          key={id}
          title={title}
          percentage={percent}
          status={status}
          selected={selectCard === id}
          onClick={() => {
            handlerSelectedCards(id);
          }}
        />
      ))}
    </div>
  );
};

export default BlockVitalCards;
