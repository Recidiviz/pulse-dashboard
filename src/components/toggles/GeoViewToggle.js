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

import React from 'react';

class GeoViewToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geoViewEnabled: true,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(changeEvent) {
    const { value } = changeEvent.target;
    this.setState((state, props) => {
      return {
        geoViewEnabled: !state.geoViewEnabled,
      };
    });

    const { setGeoViewEnabled } = this.props;
    setGeoViewEnabled(this.state.geoViewEnabled);
  }

  render() {
    return (
      <form>
        <div className="btn-group-toggle">
          <label className="btn btn-secondary active">
            <input
              type="checkbox"
              name="geo-view-enabled"
              checked={this.state.geoViewEnabled === true}
              onChange={this.handleChange}
              className="form-check-input"
            />
            {this.state.geoViewEnabled === true && (
              'Map'
            )}
            {this.state.geoViewEnabled === false && (
              'Graph'
            )}
          </label>
        </div>
      </form>
    );
  }
}

export default GeoViewToggle;
