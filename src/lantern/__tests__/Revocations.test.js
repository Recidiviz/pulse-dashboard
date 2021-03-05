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
import SelectFilter from "../FiltersBar/SelectFilter";
import DistrictFilter from "../FiltersBar/DistrictFilter";
import AdmissionTypeFilter from "../FiltersBar/AdmissionTypeFilter";
import ViolationFilter from "../FiltersBar/ViolationFilter";
import RevocationCountOverTime from "../RevocationsOverTime";
import Matrix from "../Matrix";
import RevocationCharts from "../RevocationCharts";
import CaseTable from "../CaseTable/CaseTable";
import { METADATA_NAMESPACE } from "../../constants";
import { setTranslateLocale } from "../../utils/i18nSettings";

import { US_MO } from "../../RootStore/TenantStore/lanternTenants";
import mockWithTestId from "../../../__helpers__/mockWithTestId";
import filterOptionsMap from "../../RootStore/TenantStore/filterOptions";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
} from "../utils/constants";
import { useRootStore } from "../../components/StoreProvider";
import { PageProvider } from "../../contexts/PageContext";

jest.mock("../FiltersBar/SelectFilter");
jest.mock("../FiltersBar/DistrictFilter");
jest.mock("../FiltersBar/AdmissionTypeFilter");
jest.mock("../FiltersBar/ViolationFilter");
jest.mock("../RevocationsOverTime");
jest.mock("../Matrix");
jest.mock("../RevocationCharts");
jest.mock("../CaseTable/CaseTable");
jest.mock("../../RootStore/TenantStore/filterOptions");
jest.mock("../../components/StoreProvider");

describe("Revocations component tests", () => {
  const metadataField = `${METADATA_NAMESPACE}app_metadata`;
  const mockTenantId = "TEST_TENANT";
  const mockUser = { [metadataField]: { state_code: mockTenantId } };
  const filtersBarIdPrefix = "filters-bar-";
  const DistrictFilterId = "district-filter";
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
  const SelectFilterMock = SelectFilter.type;
  const AdmissionTypeFilterMock = AdmissionTypeFilter.type;
  const ViolationFilterMock = ViolationFilter.type;
  const RevocationChartsMock = RevocationCharts.type;

  SelectFilterMock.mockImplementation(({ label }) =>
    mockWithTestId(`${filtersBarIdPrefix}${label}`)
  );
  DistrictFilterMock.mockReturnValue(mockWithTestId(DistrictFilterId));
  AdmissionTypeFilterMock.mockReturnValue(
    mockWithTestId(admissionTypeFilterId)
  );
  ViolationFilterMock.mockReturnValue(mockWithTestId(violationFilterId));
  RevocationCountOverTimeMock.mockReturnValue(
    mockWithTestId(revocationCountOverTimeId)
  );
  MatrixMock.mockReturnValue(mockWithTestId(revocationMatrixId));
  RevocationChartsMock.mockReturnValue(mockWithTestId(revocationChartsId));
  CaseTableMock.mockReturnValue(mockWithTestId(caseTableId));
  setTranslateLocale(US_MO);

  useRootStore.mockReturnValue({
    userStore: { user: mockUser, isAuthorized: true },
    currentTenantId: US_MO,
    filtersStore: {
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
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render Revocations component with proper filters and charts", () => {
    const { getByTestId } = render(
      <PageProvider>
        <Revocations />
      </PageProvider>
    );

    expect(getByTestId(`${filtersBarIdPrefix}Time Period`)).toBeInTheDocument();
    expect(getByTestId(`${filtersBarIdPrefix}Case Type`)).toBeInTheDocument();
    expect(
      getByTestId(`${filtersBarIdPrefix}Supervision Type`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`${filtersBarIdPrefix}Supervision Level`)
    ).toBeInTheDocument();

    expect(getByTestId(DistrictFilterId)).toBeInTheDocument();
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
    filterOptionsMap[mockTenantId][CHARGE_CATEGORY].componentEnabled = false;
    filterOptionsMap[mockTenantId][ADMISSION_TYPE].componentEnabled = false;
    const { queryByTestId } = render(
      <PageProvider>
        <Revocations />
      </PageProvider>
    );

    expect(queryByTestId(`${filtersBarIdPrefix}Supervision Level`)).toBeNull();
    expect(queryByTestId(`${filtersBarIdPrefix}Supervision Type`)).toBeNull();
    expect(queryByTestId(`${filtersBarIdPrefix}Case Type`)).toBeNull();
    expect(queryByTestId(admissionTypeFilterId)).toBeNull();
  });
});
