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
import { render } from "@testing-library/react";
import { observable } from "mobx";

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
import { METADATA_NAMESPACE } from "../../constants";
import { setTranslateLocale } from "../../views/tenants/utils/i18nSettings";

import { US_MO } from "../../views/tenants/utils/lanternTenants";
import mockWithTestId from "../../../__helpers__/mockWithTestId";
import filterOptionsMap from "../../views/tenants/constants/filterOptions";
import {
  ADMISSION_TYPE,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
} from "../../constants/filterTypes";
import StoreProvider from "../../StoreProvider";
import FiltersStore from "../../RootStore/FiltersStore";

jest.mock("../../react-auth0-spa");
jest.mock("../charts/new_revocations/ToggleBar/ToggleBarFilter");
jest.mock("../charts/new_revocations/ToggleBar/DistrictFilter");
jest.mock("../charts/new_revocations/ToggleBar/AdmissionTypeFilter");
jest.mock("../charts/new_revocations/ToggleBar/ViolationFilter");
jest.mock("../charts/new_revocations/RevocationsOverTime");
jest.mock("../charts/new_revocations/Matrix");
jest.mock("../charts/new_revocations/RevocationCharts");
jest.mock("../charts/new_revocations/CaseTable/CaseTable");
jest.mock("../../views/tenants/constants/filterOptions");
jest.mock("../../tenants");
jest.mock("../../RootStore/FiltersStore");

describe("Revocations component tests", () => {
  const metadataField = `${METADATA_NAMESPACE}app_metadata`;
  const mockTenantId = "TEST_TENANT";
  const mockUser = { [metadataField]: { state_code: mockTenantId } };
  const mockDistrict = "some district";
  const toggleBarIdPrefix = "toggle-bar-";
  const districtFilterId = "district-filter";
  const admissionTypeFilterId = "admission-type-filter";
  const violationFilterId = "violation-filter-id";
  const revocationCountOverTimeId = "revocation-count-over-time";
  const revocationMatrixId = "revocation-matrix";
  const revocationChartsId = "revocation-charts";
  const caseTableId = "case-table";

  const DistrictFilterMock = DistrictFilter.type;
  const RevocationCountOverTimeMock = RevocationCountOverTime.type;
  const MatrixMock = Matrix.type;
  const CaseTableMock = CaseTable.type;
  const ToggleBarFilterMock = ToggleBarFilter.type;
  const AdmissionTypeFilterMock = AdmissionTypeFilter.type;
  const ViolationFilterMock = ViolationFilter.type;

  useAuth0.mockReturnValue({ user: mockUser });
  ToggleBarFilterMock.mockImplementation(({ label }) =>
    mockWithTestId(`${toggleBarIdPrefix}${label}`)
  );
  DistrictFilterMock.mockReturnValue(mockWithTestId(districtFilterId));
  AdmissionTypeFilterMock.mockReturnValue(
    mockWithTestId(admissionTypeFilterId)
  );
  ViolationFilterMock.mockReturnValue(mockWithTestId(violationFilterId));
  RevocationCountOverTimeMock.mockReturnValue(
    mockWithTestId(revocationCountOverTimeId)
  );
  MatrixMock.mockReturnValue(mockWithTestId(revocationMatrixId));
  RevocationCharts.mockReturnValue(mockWithTestId(revocationChartsId));
  CaseTableMock.mockReturnValue(mockWithTestId(caseTableId));
  setTranslateLocale(US_MO);

  const setRestrictedDistrictMock = jest.fn();
  FiltersStore.mockImplementation(() => {
    return {
      filters: observable.map({
        metricPeriodMonths: "",
        chargeCategory: "",
        reportedViolation: "",
        violationtype: "",
        supervisionLevel: "",
        supervisionType: "",
        admissionType: "",
        district: "",
      }),
      filterOptions: filterOptionsMap[mockTenantId],
      setRestrictedDistrict: setRestrictedDistrictMock,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render Revocations component with proper filters and charts", () => {
    const { getByTestId } = render(
      <StoreProvider>
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
    filterOptionsMap[mockTenantId][SUPERVISION_LEVEL].componentEnabled = false;
    filterOptionsMap[mockTenantId][SUPERVISION_TYPE].componentEnabled = false;
    filterOptionsMap[mockTenantId][ADMISSION_TYPE].componentEnabled = false;
    filterOptionsMap[mockTenantId][ADMISSION_TYPE].filterEnabled = false;
    const { queryByTestId } = render(
      <StoreProvider>
        <Revocations />
      </StoreProvider>
    );

    expect(queryByTestId(`${toggleBarIdPrefix}Supervision Level`)).toBeNull();
    expect(queryByTestId(`${toggleBarIdPrefix}Supervision Type`)).toBeNull();
    expect(queryByTestId(admissionTypeFilterId)).toBeNull();
  });

  it("should set user district as default filter value if it is defined", () => {
    const mockUserWithDistrict = {
      [metadataField]: { state_code: mockTenantId, district: mockDistrict },
    };
    useAuth0.mockReturnValue({ user: mockUserWithDistrict });

    render(
      <StoreProvider>
        <Revocations />
      </StoreProvider>
    );

    expect(setRestrictedDistrictMock).toHaveBeenCalledWith(mockDistrict);
  });
});
