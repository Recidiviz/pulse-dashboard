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

function properName(name, replaceLa) {
  if (replaceLa) {
    return (`${name.replace(/[^\s\-\']+[\s\-\']*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      .replace(/\b(Van|De|Der|Da|Von)\b/g, (nobiliaryParticle) => nobiliaryParticle.toLowerCase())
      .replace(/Mc(.)/g, (match, letter3) => `Mc${letter3.toUpperCase()}`)
      .replace(/La(.)/g, (match, letter3) => `La${letter3.toUpperCase()}`)
    }`);
  }

  return (`${name.replace(/[^\s\-\']+[\s\-\']*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .replace(/\b(Van|De|Der|Da|Von)\b/g, (nobiliaryParticle) => nobiliaryParticle.toLowerCase())
    .replace(/Mc(.)/g, (match, letter3) => `Mc${letter3.toUpperCase()}`)
  }`);
}

function normalizeDistrictName(district, replaceLa) {
  const normalized = district.replace(/-/g, ' ');
  return properName(normalized, replaceLa);
}

class DistrictToggle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.DistrictOption = this.DistrictOption.bind(this);
    this.DistrictList = this.DistrictList.bind(this);
  }

  handleChange(changeEvent) {
    const { value } = changeEvent.target;
    const { onDistrictUpdate } = this.props;
    onDistrictUpdate(value);
  }

  DistrictOption(props) {
    return <option id={`district-toggle-${props.value}`} value={props.value}>{normalizeDistrictName(props.value, props.replaceLa)}</option>
  }

  DistrictList() {
    const { districts, replaceLa } = this.props;
    districts.sort();

    const districtOptions = districts.map(
      (district) => <this.DistrictOption key={district} value={district} replaceLa={replaceLa} />,
    );
    return (
      <select id="district-toggle" className="form-control" onChange={this.handleChange}>
        <this.DistrictOption key="all" value="all" />
        {districtOptions}
      </select>
    );
  }

  render() {
    return (
      <form>
        <this.DistrictList />
      </form>
    );
  }
}

export default DistrictToggle;
