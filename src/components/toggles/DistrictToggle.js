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

function normalizeDistrictName(district, replaceLa, stateCode) {
  const isCounty = stateCode !== undefined;
  let normalized = isCounty ? district.replace(stateCode.concat('_'), '') : district;
  normalized = normalized.replace(/-/g, ' ');
  normalized = normalized.replace(/_/g, ' ');

  const properDistrictName = properName(normalized, replaceLa);
  return isCounty ? `${properDistrictName} County` : properDistrictName;
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
    return <option id={`district-toggle-${props.value}`} value={props.value}>{normalizeDistrictName(props.display, props.replaceLa, props.stateCode)}</option>
  }

  DistrictList() {
    const { districts, replaceLa, stateCode, districtOffices } = this.props;
    districts.sort();

    let districtOptions = [];
    if (districtOffices) {
      const sortedOffices = districtOffices.sort((a, b) => (a.site_name.localeCompare(b.site_name)));
      districtOptions = sortedOffices.map(
        (district) => <this.DistrictOption key={district.district} value={district.district} display={district.site_name} replaceLa={replaceLa} stateCode={stateCode} />,
      );
    } else {
      districtOptions = districts.map(
        (district) => <this.DistrictOption key={district} value={district} display={district} replaceLa={replaceLa} stateCode={stateCode} />,
      );
    }

    return (
      <select id="district-toggle" className="form-control" onChange={this.handleChange}>
        <this.DistrictOption key="all" value="all" display="All" />
        {districtOptions}
      </select>
    );
  }

  render() {
    return (
      <form data-testid="districtToggle">
        <this.DistrictList />
      </form>
    );
  }
}

export default DistrictToggle;
