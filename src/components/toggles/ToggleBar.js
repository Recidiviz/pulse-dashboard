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

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Sticky from "react-sticky-fill";

import RadioGroup from "../controls/RadioGroup";
import Select from "../controls/Select";

import {
  defaultDistrictOption,
  defaultMetricPeriodOption,
  defaultMetricType,
  defaultSupervisionTypeOption,
  metricPeriodOptions,
  metricTypeOptions,
  supervisionTypeOptions,
} from "./options";
import { getDistrictOptions } from "./helpers";

import "./ToggleBar.scss";

const TOGGLE_STYLE = {
  zIndex: 700,
  top: 65,
};

const ToggleBar = ({
  setChartMetricType,
  setChartSupervisionType,
  setChartMetricPeriodMonths,
  setChartDistrict,
  availableDistricts,
  districtOffices,
  replaceLa,
  stateCode,
}) => {
  const isCounty = stateCode !== undefined;
  const districtOptions = useMemo(
    () =>
      getDistrictOptions(
        availableDistricts,
        districtOffices,
        replaceLa,
        stateCode
      ),
    [availableDistricts, districtOffices, replaceLa, stateCode]
  );

  return (
    <Sticky style={TOGGLE_STYLE}>
      <div className="row pB-10">
        <div className="col-md-12">
          <div className="bd bgc-white" style={{ marginLeft: -2 }}>
            <div className="row toggle-filters">
              {setChartMetricType && (
                <div className="toggle-filters__filter" id="metricTypeToggle">
                  <RadioGroup
                    options={metricTypeOptions}
                    onChange={setChartMetricType}
                    defaultValue={defaultMetricType}
                  />
                </div>
              )}

              {setChartMetricPeriodMonths && (
                <div className="toggle-filters__filter" id="metricPeriodToggle">
                  <span className="toggle-filters__filter-title">
                    Time period
                  </span>
                  <div className="toggle-filters__select">
                    <Select
                      options={metricPeriodOptions}
                      onChange={(option) => {
                        setChartMetricPeriodMonths(option.value);
                      }}
                      defaultValue={defaultMetricPeriodOption}
                    />
                  </div>
                </div>
              )}

              {setChartSupervisionType && (
                <div
                  className="toggle-filters__filter"
                  id="supervisionTypeToggle"
                >
                  <span className="toggle-filters__filter-title">
                    Supervision type
                  </span>
                  <div className="toggle-filters__select">
                    <Select
                      options={supervisionTypeOptions}
                      onChange={(option) => {
                        setChartSupervisionType(option.value);
                      }}
                      defaultValue={defaultSupervisionTypeOption}
                      isSearchable={false}
                    />
                  </div>
                </div>
              )}

              {setChartDistrict && (
                <div className="toggle-filters__filter" id="districtToggle">
                  <span className="toggle-filters__filter-title">
                    {isCounty ? "County of Residence" : "Office"}
                  </span>
                  <div className="toggle-filters__select">
                    <Select
                      options={districtOptions}
                      onChange={(options) => {
                        setChartDistrict(options.map((o) => String(o.value)));
                      }}
                      isMulti
                      allOption={defaultDistrictOption}
                      defaultValue={[defaultDistrictOption]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sticky>
  );
};

ToggleBar.defaultProps = {
  setChartMetricType: undefined,
  setChartSupervisionType: undefined,
  setChartMetricPeriodMonths: undefined,
  setChartDistrict: undefined,
  availableDistricts: undefined,
  districtOffices: undefined,
  replaceLa: false,
  stateCode: undefined,
};

ToggleBar.propTypes = {
  setChartMetricType: PropTypes.func,
  setChartSupervisionType: PropTypes.func,
  setChartMetricPeriodMonths: PropTypes.func,
  setChartDistrict: PropTypes.func,
  availableDistricts: PropTypes.arrayOf(PropTypes.string),
  districtOffices: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.number.isRequired,
      site_name: PropTypes.string.isRequired,
    })
  ),
  replaceLa: PropTypes.bool,
  stateCode: PropTypes.string,
};

export default ToggleBar;
