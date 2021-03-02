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

import React from "react";
import { act, render } from "@testing-library/react";
import { observable } from "mobx";

import ToggleBarFilter from "../ToggleBarFilter";
import Select from "../../../controls/Select";
import FilterField from "../FilterField";
import {
  METRIC_PERIOD_MONTHS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
} from "../../../constants/filterTypes";
import { useRootStore } from "../../../StoreProvider";
import { METADATA_NAMESPACE } from "../../../constants";
import { US_MO } from "../../../RootStore/TenantStore/lanternTenants";
import filterOptions from "../../../views/tenants/constants/filterOptions";

jest.mock("../../../controls/Select", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../FilterField", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../../StoreProvider");

describe("ToggleBarFilter tests", () => {
  const metadataField = `${METADATA_NAMESPACE}app_metadata`;
  const mockUser = { [metadataField]: { state_code: US_MO } };
  const setFiltersMock = jest.fn();
  useRootStore.mockReturnValue({
    userStore: { user: mockUser, isAuthorized: true },
    currentTenantId: US_MO,
    filtersStore: {
      filters: observable.map({
        metricPeriodMonths:
          filterOptions[US_MO][METRIC_PERIOD_MONTHS].defaultValue,
        supervisionLevel: filterOptions[US_MO][SUPERVISION_LEVEL].defaultValue,
        supervisionType: filterOptions[US_MO][SUPERVISION_TYPE].defaultValue,
      }),
      filterOptions: filterOptions[US_MO],
      setFilters: setFiltersMock,
    },
  });

  FilterField.mockImplementation(({ children }) => children);
  Select.mockReturnValue(null);

  [
    { label: "Time Period", dimension: METRIC_PERIOD_MONTHS },
    { label: "Supervision Level", dimension: SUPERVISION_LEVEL },
    { label: "Supervision Type", dimension: SUPERVISION_TYPE },
  ].forEach((props) => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should pass valid props to Select", () => {
      render(
        <ToggleBarFilter label={props.label} dimension={props.dimension} />
      );

      expect(Select).toHaveBeenCalledTimes(1);
      expect(Select.mock.calls[0][0]).toMatchObject({
        value: filterOptions[US_MO][props.dimension].defaultOption,
        options: filterOptions[US_MO][props.dimension].options,
        defaultValue: filterOptions[US_MO][props.dimension].defaultOption,
      });
    });
  });

  [
    { label: "Time Period", dimension: METRIC_PERIOD_MONTHS },
    { label: "Supervision Level", dimension: SUPERVISION_LEVEL },
    { label: "Supervision Type", dimension: SUPERVISION_TYPE },
  ].forEach((props) => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("onChange should change the filter value", () => {
      const updatedfilters = {
        [props.dimension]: 99,
      };

      render(
        <ToggleBarFilter label="Time Period" dimension={props.dimension} />
      );

      act(() => {
        Select.mock.calls[0][0].onChange({ value: 99 });
      });

      expect(setFiltersMock).toHaveBeenCalledTimes(1);
      expect(setFiltersMock.mock.calls[0][0]).toMatchObject(updatedfilters);
    });
  });
});
