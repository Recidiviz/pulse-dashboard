import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./CoreVitalSummaryCard.scss";

const statusStyles = (status) => {
  switch (status) {
    case "NEEDS_IMPROVEMENT":
      return "CoreVitalSummaryCard__needs-improvement";
    case "POOR":
      return "CoreVitalSummaryCard__poor";
    case "GOOD":
      return "CoreVitalSummaryCard__good";
    case "GREAT":
      return "CoreVitalSummaryCard__great";
    case "EXCELLENT":
      return "CoreVitalSummaryCard__excellent";

    default:
      return "";
  }
};

const CoreVitalSummaryCard = ({
  title,
  percentage,
  status,
  selected,
  onClick,
}) => (
  <div
    role="presentation"
    onKeyDown={onClick}
    onClick={onClick}
    className={cn(
      "CoreVitalSummaryCard",
      { selected },
      statusStyles(status),
      "p-0"
    )}
  >
    <div className={`${cn(statusStyles(status))}__top-border top-border`} />
    <div className={`${cn(statusStyles(status))}__content content p-0`}>
      <div className="CoreVitalSummaryCard__title">
        <span>{title}</span>
      </div>
      <div
        className={`CoreVitalSummaryCard__percent ${cn(
          statusStyles(status)
        )}__percent`}
      >
        <span>{percentage}%</span>
      </div>
    </div>
  </div>
);
CoreVitalSummaryCard.defaultProps = {
  selected: false,
};

CoreVitalSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
  status: PropTypes.oneOf(["POOR", "NEEDS_IMPROVEMENT", "GOOD", "GREAT"])
    .isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default CoreVitalSummaryCard;
