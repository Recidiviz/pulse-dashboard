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

import Revocations from "../Revocations";
import ToggleBarFilter from "../charts/new_revocations/ToggleBar/ToggleBarFilter";
import DistrictFilter from "../charts/new_revocations/ToggleBar/DistrictFilter";
import AdmissionTypeFilter from "../charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "../charts/new_revocations/ToggleBar/ViolationFilter";
import RevocationCountOverTime from "../charts/new_revocations/RevocationsOverTime";
import Matrix from "../charts/new_revocations/Matrix";
import RevocationCharts from "../charts/new_revocations/RevocationCharts";
import CaseTable from "../charts/new_revocations/CaseTable/CaseTable";
import { useAuth0 } from "../../react-auth0-spa";
import { useStateCode } from "../../contexts/StateCodeContext";
import { getUserAppMetadata } from "../../utils/authentication/user";
import { setTranslateLocale } from "../../views/tenants/utils/i18nSettings";

import { MO } from "../../views/tenants/utils/lanternTenants";
import mockWithTestId from "../../../__helpers__/mockWithTestId";
import filterOptionsMap from "../../views/tenants/constants/filterOptions";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../../constants/filterTypes";
import StoreProvider from "../../StoreProvider";

jest.mock("../../react-auth0-spa");
jest.mock("../../contexts/StateCodeContext");
jest.mock("../../utils/authentication/user");
jest.mock("../charts/new_revocations/ToggleBar/ToggleBarFilter");
jest.mock("../charts/new_revocations/ToggleBar/DistrictFilter");
jest.mock("../charts/new_revocations/ToggleBar/AdmissionTypeFilter");
jest.mock("../charts/new_revocations/ToggleBar/ViolationFilter");
jest.mock("../charts/new_revocations/RevocationsOverTime");
jest.mock("../charts/new_revocations/Matrix");
jest.mock("../charts/new_revocations/RevocationCharts");
jest.mock("../charts/new_revocations/CaseTable/CaseTable");
jest.mock("../../views/tenants/constants/filterOptions");
describe("Revocations component tests", () => {
  const mockUser = {};
  const mockDistrict = "some district";
  const mockStateCode = "test_state";
  const toggleBarIdPrefix = "toggle-bar-";
  const districtFilterId = "district-filter";
  const admissionTypeFilterId = "admission-type-filter";
  const violationFilterId = "violation-filter-id";
  const revocationCountOverTimeId = "revocation-count-over-time";
  const revocationMatrixId = "revocation-matrix";
  const revocationChartsId = "revocation-charts";
  const caseTableId = "case-table";

  useAuth0.mockReturnValue({ user: mockUser });
  ToggleBarFilter.mockImplementation(({ label }) =>
    mockWithTestId(`${toggleBarIdPrefix}${label}`)
  );
  DistrictFilter.mockReturnValue(mockWithTestId(districtFilterId));
  AdmissionTypeFilter.mockReturnValue(mockWithTestId(admissionTypeFilterId));
  ViolationFilter.mockReturnValue(mockWithTestId(violationFilterId));
  RevocationCountOverTime.type.mockReturnValue(
    mockWithTestId(revocationCountOverTimeId)
  );
  Matrix.mockReturnValue(mockWithTestId(revocationMatrixId));
  RevocationCharts.mockReturnValue(mockWithTestId(revocationChartsId));
  CaseTable.mockReturnValue(mockWithTestId(caseTableId));
  useStateCode.mockReturnValue({ currentStateCode: mockStateCode });
  setTranslateLocale(MO);

  beforeEach(() => {
    jest.clearAllMocks();
    getUserAppMetadata.mockReturnValue({ district: undefined });
  });

  it("should render Revocations component with proper filters and charts", () => {
    const { getByTestId } = render(
      <StoreProvider stateCode={mockStateCode}>
        <Revocations />
      </StoreProvider>
    );

    expect(getByTestId(`${toggleBarIdPrefix}Time Period`)).toBeInTheDocument();
    expect(getByTestId(`${toggleBarIdPrefix}Case Type`)).toBeInTheDocument();
    expect(
      getByTestId(`${toggleBarIdPrefix}Supervision Type`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`${toggleBarIdPrefix}Supervision Level`)
    ).toBeInTheDocument();

    expect(getByTestId(districtFilterId)).toBeInTheDocument();
    expect(getByTestId(admissionTypeFilterId)).toBeInTheDocument();
    expect(getByTestId(violationFilterId)).toBeInTheDocument();
    expect(getByTestId(revocationCountOverTimeId)).toBeInTheDocument();
    expect(getByTestId(revocationMatrixId)).toBeInTheDocument();
    expect(getByTestId(revocationChartsId)).toBeInTheDocument();
    expect(getByTestId(caseTableId)).toBeInTheDocument();
  });

  it("should not render supervision type and supervision level if they are not enabled", () => {
    filterOptionsMap[mockStateCode][SUPERVISION_LEVEL].componentEnabled = false;
    filterOptionsMap[mockStateCode][SUPERVISION_TYPE].componentEnabled = false;
    filterOptionsMap[mockStateCode][ADMISSION_TYPE].componentEnabled = false;
    filterOptionsMap[mockStateCode][ADMISSION_TYPE].filterEnabled = false;
    const { queryByTestId } = render(
      <StoreProvider stateCode={mockStateCode}>
        <Revocations />
      </StoreProvider>
    );

    expect(queryByTestId(`${toggleBarIdPrefix}Supervision Level`)).toBeNull();
    expect(queryByTestId(`${toggleBarIdPrefix}Supervision Type`)).toBeNull();
    expect(queryByTestId(admissionTypeFilterId)).toBeNull();
  });

  it("should pass correct defaultValues to filters", () => {
    filterOptionsMap[mockStateCode][SUPERVISION_LEVEL].componentEnabled = true;
    filterOptionsMap[mockStateCode][SUPERVISION_TYPE].componentEnabled = true;
    filterOptionsMap[mockStateCode][ADMISSION_TYPE].componentEnabled = true;
    filterOptionsMap[mockStateCode][ADMISSION_TYPE].filterEnabled = true;
    render(
      <StoreProvider stateCode={mockStateCode}>
        <Revocations />
      </StoreProvider>
    );

    const timePeriodFilterMocks = ToggleBarFilter.mock.calls.filter(
      (call) => call[0].label === "Time Period"
    );
    const caseTypeFilterMocks = ToggleBarFilter.mock.calls.filter(
      (call) => call[0].label === "Case Type"
    );
    const supervisionTypeFilterMocks = ToggleBarFilter.mock.calls.filter(
      (call) => call[0].label === "Supervision Type"
    );
    const supervisionLevelFilterMocks = ToggleBarFilter.mock.calls.filter(
      (call) => call[0].label === "Supervision Level"
    );

    const filterOptions = filterOptionsMap[mockStateCode];

    expect(timePeriodFilterMocks[0][0].value).toBe(
      filterOptions[METRIC_PERIOD_MONTHS].defaultValue
    );
    expect(caseTypeFilterMocks[0][0].value).toBe(
      filterOptions[CHARGE_CATEGORY].defaultValue
    );
    expect(supervisionTypeFilterMocks[0][0].value).toBe(
      filterOptions[SUPERVISION_TYPE].defaultValue
    );
    expect(supervisionLevelFilterMocks[0][0].value).toBe(
      filterOptions[SUPERVISION_LEVEL].defaultValue
    );
    expect(DistrictFilter.mock.calls[0][0].value).toEqual([
      filterOptions[DISTRICT].defaultValue,
    ]);
    expect(AdmissionTypeFilter.mock.calls[0][0].value).toEqual(
      filterOptions[ADMISSION_TYPE].defaultValue
    );
    expect(ViolationFilter.mock.calls[0][0].violationType).toBe(
      filterOptions[VIOLATION_TYPE].defaultValue
    );
  });

  it("should set user district as default filter value if it is defined", () => {
    getUserAppMetadata.mockReturnValue({ district: mockDistrict });

    render(
      <StoreProvider stateCode={mockStateCode}>
        <Revocations />
      </StoreProvider>
    );

    expect(DistrictFilter.mock.calls[1][0].value).toEqual([mockDistrict]);
  });

  it("should change filter value when onChange is called", () => {
    const mockNewDistrictValue = ["some new value"];
    render(
      <StoreProvider stateCode={mockStateCode}>
        <Revocations />
      </StoreProvider>
    );

    act(() => {
      DistrictFilter.mock.calls[0][0].onChange(mockNewDistrictValue);
    });

    expect(DistrictFilter).toHaveBeenCalledTimes(2);
    expect(DistrictFilter.mock.calls[1][0].value).toEqual(mockNewDistrictValue);
  });

  it("should update filter values when updateFilters is called", () => {
    const mockNewViolationTypeValue = "some new value";
    const mockNewReportedViolationsValue = "some new value 1";

    render(
      <StoreProvider stateCode={mockStateCode}>
        <Revocations />
      </StoreProvider>
    );

    act(() => {
      ViolationFilter.mock.calls[0][0].onClick({
        [VIOLATION_TYPE]: mockNewViolationTypeValue,
        [REPORTED_VIOLATIONS]: mockNewReportedViolationsValue,
      });
    });

    expect(ViolationFilter.mock.calls[1][0].violationType).toBe(
      mockNewViolationTypeValue
    );
    expect(ViolationFilter.mock.calls[1][0].reportedViolations).toBe(
      mockNewReportedViolationsValue
    );
  });
});
