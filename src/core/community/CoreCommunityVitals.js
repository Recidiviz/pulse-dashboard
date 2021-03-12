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
import PropTypes from "prop-types";

import PageTemplate from "../PageTemplate";
import BlockVitalCards from "./BlockVitalCards";

import "./CoreCommunityVitals.scss";

const CoreCommunityVitals = ({ stateCode }) => {
  const getStateName = (code) => {
    switch (code) {
      case "US_ND":
        return "North Dakota";
      default:
        return "DEMO";
    }
  };
  return (
    <PageTemplate>
      <div className="CoreCommunityVitals__Title col-12">
        {getStateName(stateCode)}
      </div>
      <BlockVitalCards />
    </PageTemplate>
  );
};

CoreCommunityVitals.propTypes = {
  stateCode: PropTypes.string.isRequired,
};

export default CoreCommunityVitals;
