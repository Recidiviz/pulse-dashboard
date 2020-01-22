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

class MetricTypeToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'counts',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(changeEvent) {
    const { value } = changeEvent.target;
    this.setState({
      selectedOption: value,
    });

    const { onMetricTypeUpdate } = this.props;
    onMetricTypeUpdate(value);
  }

  render() {
    return (
      <form>
        <div className="form-check">
          <label>
            <input
              type="radio"
              name="metric-type"
              value="counts"
              checked={this.state.selectedOption === 'counts'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            Counts
          </label>
        </div>

        <div className="form-check">
          <label>
            <input
              type="radio"
              name="metric-type"
              value="rates"
              checked={this.state.selectedOption === 'rates'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            Rates
          </label>
        </div>
      </form>
    );
  }
}

export default MetricTypeToggle;
