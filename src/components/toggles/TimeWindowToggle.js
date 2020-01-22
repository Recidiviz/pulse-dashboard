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

class TimeWindowToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '12',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(changeEvent) {
    const { value } = changeEvent.target;
    this.setState({
      selectedOption: value,
    });

    const { onTimeUpdate } = this.props;
    onTimeUpdate(value);
  }

  render() {
    return (
      <form>
        <div className="form-check form-check-inline">
          <label>
            <input
              type="radio"
              name="time-window"
              value="36"
              checked={this.state.selectedOption === '36'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            3y
          </label>
        </div>

        <div className="form-check form-check-inline">
          <label>
            <input
              type="radio"
              name="time-window"
              value="12"
              checked={this.state.selectedOption === '12'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            1y
          </label>
        </div>

        <div className="form-check form-check-inline">
          <label>
            <input
              type="radio"
              name="time-window"
              value="6"
              checked={this.state.selectedOption === '6'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            6m
          </label>
        </div>

        <div className="form-check form-check-inline">
          <label>
            <input
              type="radio"
              name="time-window"
              value="3"
              checked={this.state.selectedOption === '3'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            3m
          </label>
        </div>

        <div className="form-check form-check-inline">
          <label>
            <input
              type="radio"
              name="time-window"
              value="1"
              checked={this.state.selectedOption === '1'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            1m
          </label>
        </div>
      </form>
    );
  }
}

export default TimeWindowToggle;
