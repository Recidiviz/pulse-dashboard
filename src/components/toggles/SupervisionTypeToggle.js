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

class SupervisionTypeToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'all',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(changeEvent) {
    const { value } = changeEvent.target;
    this.setState({
      selectedOption: value,
    });

    const { onSupervisionTypeUpdate } = this.props;
    onSupervisionTypeUpdate(value);
  }

  render() {
    return (
      <form>
        <div className="form-check">
          <label>
            <input
              type="radio"
              name="supervision-type"
              value="all"
              checked={this.state.selectedOption === 'all'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            Everyone
          </label>
        </div>

        <div className="form-check">
          <label>
            <input
              type="radio"
              name="supervision-type"
              value="probation"
              checked={this.state.selectedOption === 'probation'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            Individuals on probation
          </label>
        </div>

        <div className="form-check">
          <label>
            <input
              type="radio"
              name="supervision-type"
              value="parole"
              checked={this.state.selectedOption === 'parole'}
              onChange={this.handleChange}
              className="form-check-input"
            />
            Individuals on parole
          </label>
        </div>
      </form>
    );
  }
}

export default SupervisionTypeToggle;
