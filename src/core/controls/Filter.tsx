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

type FilterProps = {
  title?: string;
  children: React.ReactNode;
  width?: string;
};

const Filter: React.FC<FilterProps> = ({ children, title, width }) => {
  return (
    <div className="Filter">
      {title && <span className="Filter__title">{title}</span>}
      {width ? <div style={{ width }}>{children}</div> : children}
    </div>
  );
};
export default Filter;
