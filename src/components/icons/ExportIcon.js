import React from "react";

const ExportIcon = ({ width = 20, height = 5 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="17.5" cy="2.5" r="2.5" fill="currentColor" />
      <circle cx="10" cy="2.5" r="2.5" fill="currentColor" />
      <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
    </svg>
  );
};

export default ExportIcon;
