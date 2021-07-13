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
import React, { useCallback, useMemo } from "react";

import { CoreSelect } from "./controls/CoreSelect";
import Filter from "./controls/Filter";
import FilterBar from "./controls/FilterBar";
import CoreMultiSelect from "./controls/MultiSelect/CoreMultiSelect";
import TogglePill from "./controls/TogglePill";
import { FilterOption } from "./types/filters";
import { getDistrictOptions } from "./utils/filterHelpers";
import {
  defaultDistrictOption,
  defaultMetricPeriodOption,
  defaultSupervisionTypeOption,
  getFilterOption,
  metricPeriodOptions,
  metricTypeOptions,
  supervisionTypeOptions,
} from "./utils/filterOptions";

type CoreFilterBarProps = {
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

const CoreFilterBar: React.FC<CoreFilterBarProps> = ({
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
  const isCounty = stateCode != null;
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

  return (
    <FilterBar>
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
        <Filter title="Time Period" width="8rem">
          <CoreSelect
            value={getFilterOption(metricPeriodMonths, metricPeriodOptions)}
            options={metricPeriodOptions}
            onChange={createOnFilterChange(setChartMetricPeriodMonths)}
            defaultValue={defaultMetricPeriodOption}
          />
        </Filter>
      )}

      {setChartSupervisionType && supervisionType && (
        <Filter title="Supervision Type" width="8.5rem">
          <CoreSelect
            value={getFilterOption(supervisionType, supervisionTypeOptions)}
            options={supervisionTypeOptions}
            onChange={createOnFilterChange(setChartSupervisionType)}
            defaultValue={defaultSupervisionTypeOption}
            isSearchable={false}
          />
        </Filter>
      )}

      {setChartDistrict && district && (
        <Filter title={isCounty ? "County of Residence" : "Office"}>
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
        </Filter>
      )}
    </FilterBar>
  );
};

export default CoreFilterBar;
