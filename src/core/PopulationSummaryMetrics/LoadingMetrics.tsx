import React from "react";
import { MetricTitle } from "./SummaryMetric";
import "./LoadingMetrics.scss";

const LoadingMetrics: React.FC<{ title: string; showMinMax?: boolean }> = ({
  title,
  showMinMax = false,
}) => {
  return (
    <div className="LoadingMetrics">
      <MetricTitle>{title}</MetricTitle>
      <div className="LoadingMetrics__value" />
      <div className="LoadingMetrics__percent" />
      {showMinMax && <div className="LoadingMetrics__minMax" />}
    </div>
  );
};
export default LoadingMetrics;
