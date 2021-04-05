// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import BounceLoader from "react-spinners/BounceLoader";

const override = {
  display: "block",
  margin: "0 auto",
};

const Loading = () => (
  <div className="Loading sweet-loading" style={{ margin: "0 auto" }}>
    <BounceLoader css={override} size={60} color="#8B2D21" />
  </div>
);

export default Loading;
