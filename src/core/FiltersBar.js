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

import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Sticky from "react-sticky-fill";

import RadioGroup from "../controls/RadioGroup";
import Select from "../controls/Select";
import MultiSelect from "../controls/MultiSelect";

import {
  defaultDistrictOption,
  defaultMetricPeriodOption,
  defaultMetricType,
  defaultSupervisionTypeOption,
  metricPeriodOptions,
  metricTypeOptions,
  supervisionTypeOptions,
} from "./utils/filterOptions";
import { getDistrictOptions } from "./utils/filterHelpers";

import "./FiltersBar.scss";

const FILTER_BAR_STYLE = {
  zIndex: 700,
  top: 65,
};

const FiltersBar = ({
  setChartMetricType = null,
  setChartSupervisionType = null,
  setChartMetricPeriodMonths = null,
  setChartDistrict = null,
  metricPeriodMonths,
  district,
  supervisionType,
  availableDistricts = [],
  districtOffices = null,
  replaceLa = false,
  stateCode = null,
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

  const createOnFilterChange = useCallback(
    (func) => (option) => {
      func(option.value);
    },
    []
  );

  const getFilterValue = useCallback(
    (value, options) => options.find((option) => option.value === value),
    []
  );

  return (
    <Sticky style={FILTER_BAR_STYLE}>
      <div className="FiltersBar row pB-10">
        <div className="col-md-12">
          <div className="bd bgc-white" style={{ marginLeft: -2 }}>
            <div className="row filters">
              {setChartMetricType && (
                <div className="filters__filter" id="metricTypeFilter">
                  <RadioGroup
                    options={metricTypeOptions}
                    onChange={setChartMetricType}
                    defaultValue={defaultMetricType}
                  />
                </div>
              )}

              {setChartMetricPeriodMonths && (
                <div className="filters__filter" id="metricPeriodFilter">
                  <span className="filters__filter-title">Time period</span>
                  <div className="filters__select">
                    <Select
                      value={getFilterValue(
                        metricPeriodMonths,
                        metricPeriodOptions
                      )}
                      options={metricPeriodOptions}
                      onChange={createOnFilterChange(
                        setChartMetricPeriodMonths
                      )}
                      defaultValue={defaultMetricPeriodOption}
                    />
                  </div>
                </div>
              )}

              {setChartSupervisionType && (
                <div className="filters__filter" id="supervisionTypeFilter">
                  <span className="filters__filter-title">
                    Supervision type
                  </span>
                  <div className="filters__select">
                    <Select
                      value={getFilterValue(
                        supervisionType,
                        supervisionTypeOptions
                      )}
                      options={supervisionTypeOptions}
                      onChange={createOnFilterChange(setChartSupervisionType)}
                      defaultValue={defaultSupervisionTypeOption}
                      isSearchable={false}
                    />
                  </div>
                </div>
              )}

              {setChartDistrict && (
                <div className="filters__filter" id="districtFilter">
                  <span className="filters__filter-title">
                    {isCounty ? "County of Residence" : "Office"}
                  </span>
                  <div className="filters__select">
                    <MultiSelect
                      value={districtOptions.filter((option) =>
                        district.includes(String(option.value))
                      )}
                      options={districtOptions}
                      onChange={(options) => {
                        setChartDistrict(options.map((o) => String(o.value)));
                      }}
                      summingOption={defaultDistrictOption}
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

FiltersBar.defaultProps = {
  setChartMetricType: null,
  setChartSupervisionType: null,
  setChartMetricPeriodMonths: null,
  setChartDistrict: null,
  availableDistricts: [],
  districtOffices: null,
  replaceLa: false,
  stateCode: null,
  metricPeriodMonths: null,
  district: null,
  supervisionType: null,
};

FiltersBar.propTypes = {
  metricPeriodMonths: PropTypes.string,
  district: PropTypes.arrayOf(PropTypes.string),
  supervisionType: PropTypes.string,
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

export default FiltersBar;
