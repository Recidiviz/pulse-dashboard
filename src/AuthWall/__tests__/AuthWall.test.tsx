// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import AuthWall from "../AuthWall";
import { useRootStore } from "../../components/StoreProvider";
import Loading from "../../components/Loading";
import mockWithTestId from "../../../__helpers__/mockWithTestId";
import { ERROR_MESSAGES } from "../../constants";

jest.mock("../../components/StoreProvider");
jest.mock("../../components/Loading");
const LoadingMock = Loading as jest.Mock;

const mockLoadingTestId = "loading-test-id";
LoadingMock.mockReturnValue(mockWithTestId(mockLoadingTestId));

let userStore: any;
const authErrorMock = jest.fn();

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation();
  jest.clearAllMocks();
  userStore = {
    user: {},
    allowedSupervisionLocationIds: [],
    userIsLoading: false,
    isAuthorized: true,
    availableStateCodes: ["US_MO"],
    authError: undefined,
    userAppMetadata: {
      can_access_leadership_dashboard: true,
      can_access_case_triage: true,
    },
    setAuthError: authErrorMock,
  };
});

afterAll(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

test("shows loading component when userIsLoading", () => {
  userStore.userIsLoading = true;

  (useRootStore as jest.Mock).mockReturnValue({
    userStore,
    currentTenantId: "US_MO",
  });
  const { getByTestId } = render(<AuthWall />);
  expect(getByTestId(mockLoadingTestId)).toBeInTheDocument();
});

test("renders children when can_access_leadership_dashboard", () => {
  userStore.userAppMetadata = {
    can_access_leadership_dashboard: true,
    can_access_case_triage: false,
  };

  (useRootStore as jest.Mock).mockReturnValue({
    userStore,
    currentTenantId: "US_MO",
  });
  const { getByText } = render(
    <AuthWall>
      {/* @ts-ignore */}
      <div tenantIds={["US_MO"]}>AUTHORIZED</div>
    </AuthWall>
  );
  expect(getByText("AUTHORIZED")).toBeInTheDocument();
});

test("redirects to case triage when !can_access_leadership_dashboard and can_access_case_triage", () => {
  userStore.userAppMetadata = {
    can_access_leadership_dashboard: false,
    can_access_case_triage: true,
  };

  (useRootStore as jest.Mock).mockReturnValue({
    userStore,
    currentTenantId: "US_MO",
  });
  render(
    <AuthWall>
      {/* @ts-ignore */}
      <div tenantIds={["US_MO"]}>AUTHORIZED</div>
    </AuthWall>
  );
  expect(window.location.href).not.toMatch("http://app-staging.recidiviz.org");
});

test("sets an auth error when !can_access_leadership_dashboard and !can_access_case_triage", () => {
  userStore.userAppMetadata = {
    can_access_leadership_dashboard: false,
    can_access_case_triage: false,
  };

  (useRootStore as jest.Mock).mockReturnValue({
    userStore,
    currentTenantId: "US_MO",
  });
  render(
    <AuthWall>
      {/* @ts-ignore */}
      <div tenantIds={["US_MO"]}>AUTHORIZED</div>
    </AuthWall>
  );
  expect(authErrorMock).toHaveBeenCalledWith(ERROR_MESSAGES.unauthorized);
});
