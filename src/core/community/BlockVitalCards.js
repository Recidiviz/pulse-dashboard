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
  const sortFunction = (a, b) => {
    if (a.percent > b.percent) {
      return 1;
    }
    if (a.percent < b.percent) {
      return -1;
    }
    return 0;
  };
  const groupingCard = groupBy(mockCardContent, "status");
  const orderedCard = [
    ...get(groupingCard, "NEEDS_IMPROVEMENT", []).sort(sortFunction),
    ...get(groupingCard, "POOR", []).sort(sortFunction),
    ...get(groupingCard, "GOOD", []).sort(sortFunction),
    ...get(groupingCard, "GREAT", []).sort(sortFunction),
  ];

  return (
    <div className="CoreCommunityVitals__card-container col-12 row">
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
