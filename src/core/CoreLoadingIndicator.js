import React from "react";
import "./CoreLoadingIndicator.scss";

export const CoreLoading = () => (
  <div className="Core-Loading">
    <div className="loading-ring">
      <div className="loading-ring__circle" />
      <div className="loading-ring__circle" />
      <div className="loading-ring__circle" />
      <div className="loading-ring__circle" />
    </div>
    <div className="Core-Loading__title">Loading data...</div>
  </div>
);
