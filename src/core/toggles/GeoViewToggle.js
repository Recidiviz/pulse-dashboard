// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from "react";
import PropTypes from "prop-types";

const GeoViewToggle = ({ setGeoViewEnabled: onChange }) => {
  const [geoViewEnabled, setGeoViewEnabled] = useState(false);

  return (
    <div className="GeoViewToggle btn-group-toggle">
      <label className="btn btn-sm btn-secondary active">
        <input
          type="checkbox"
          name="geo-view-enabled"
          checked={geoViewEnabled}
          onChange={() => {
            const updatedGeoViewEnabled = !geoViewEnabled;
            setGeoViewEnabled(updatedGeoViewEnabled);
            onChange(updatedGeoViewEnabled);
          }}
          className="form-check-input"
        />
        {geoViewEnabled ? "Graph" : "Map"}
      </label>
    </div>
  );
};

GeoViewToggle.propTypes = {
  setGeoViewEnabled: PropTypes.func.isRequired,
};

export default GeoViewToggle;
