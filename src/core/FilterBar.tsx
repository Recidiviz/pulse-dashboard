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
// @ts-ignore
import Sticky from "react-sticky-fill";

import { CoreSelect } from "./controls/CoreSelect";
import CoreMultiSelect from "./controls/MultiSelect/CoreMultiSelect";

import {
  defaultDistrictOption,
  defaultMetricPeriodOption,
  defaultSupervisionTypeOption,
  metricPeriodOptions,
  metricTypeOptions,
  supervisionTypeOptions,
} from "./utils/filterOptions";
import { getDistrictOptions } from "./utils/filterHelpers";

import "./FilterBar.scss";
import TogglePill from "./controls/TogglePill";

const FILTER_BAR_STYLE = {
  zIndex: 700,
  top: 65,
};

type FilterOption = {
  label: string;
  value: any;
};

type FilterProps = {
  title?: string;
  children: React.ReactNode;
  width?: string;
};

const Filter: React.FC<FilterProps> = ({ children, title, width }) => {
  return (
    <div className="Filter">
      {title && <span className="Filter__title">{title}</span>}
      {width ? <div style={{ width }}>{children}</div> : children}
    </div>
  );
};

type FilterBarProps = {
  metricType?: string;
  metricPeriodMonths?: string;
  district?: string[];
  supervisionType?: string;
  setChartMetricType?: (value: string) => void;
  setChartSupervisionType?: (value: string) => void;
  setChartMetricPeriodMonths?: (value: string) => void;
  setChartDistrict?: (value: string[]) => void;
  availableDistricts?: string[];
  districtOffices?: {
    district: number;
    // eslint-disable-next-line camelcase
    site_name: string;
  }[];
  replaceLa?: boolean;
  stateCode?: string;
};

const FilterBar: React.FC<FilterBarProps> = ({
  metricType = null,
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
    (func) => (option: FilterOption) => {
      func(option.value);
    },
    []
  );

  const getFilterValue = useCallback(
    (value: string, options: FilterOption[]): FilterOption =>
      options.find((option) => option.value === value) ?? options[0],
    []
  );

  return (
    <Sticky style={FILTER_BAR_STYLE}>
      <div className="FilterBar">
        <div className="FilterBar__filters">
          {setChartMetricType && metricType && (
            <Filter>
              <TogglePill
                leftPill={metricTypeOptions[0]}
                rightPill={metricTypeOptions[1]}
                onChange={setChartMetricType}
                currentValue={metricType}
              />
            </Filter>
          )}

          {setChartMetricPeriodMonths && metricPeriodMonths && (
            <Filter title="Time Period" width="7rem">
              <CoreSelect
                value={getFilterValue(metricPeriodMonths, metricPeriodOptions)}
                options={metricPeriodOptions}
                onChange={createOnFilterChange(setChartMetricPeriodMonths)}
                defaultValue={defaultMetricPeriodOption}
              />
            </Filter>
          )}

          {setChartSupervisionType && supervisionType && (
            <Filter title="Supervision Type" width="7rem">
              <CoreSelect
                value={getFilterValue(
                  supervisionType,
                  supervisionTypeOptions
                )}
                options={supervisionTypeOptions}
                onChange={createOnFilterChange(setChartSupervisionType)}
                defaultValue={defaultSupervisionTypeOption}
                isSearchable={false}
              />
            </Filter>
          )}

          {setChartDistrict && district && (
            <Filter title={isCounty ? "County of Residence" : "Office"}>
              <div className="filters__select">
                <CoreMultiSelect
                  value={districtOptions.filter((option: FilterOption) =>
                    district.includes(String(option.value))
                  )}
                  options={districtOptions}
                  onChange={(options: FilterOption[]) => {
                    setChartDistrict(options.map((o) => String(o.value)));
                  }}
                  summingOption={defaultDistrictOption}
                  defaultValue={[defaultDistrictOption]}
                />
              </div>
            </Filter>
          )}
        </div>
      </div>
    </Sticky>
  );
};

export default FilterBar;
