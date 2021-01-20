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

import React from "react";
import { render } from "@testing-library/react";

import App from "../App";
import { METADATA_NAMESPACE } from "../constants";
import { US_ND } from "../views/tenants/utils/coreTenants";
import { US_MO, US_PA } from "../views/tenants/utils/lanternTenants";

import mockWithTestId from "../../__helpers__/mockWithTestId";
import Revocations from "../components/Revocations";
import UsNDCommunityGoals from "../views/tenants/us_nd/community/Goals";
import NotFound from "../views/NotFound";
import Loading from "../components/Loading";
import LanternLayout from "../components/layouts/LanternLayout";
import CoreLayout from "../components/layouts/CoreLayout";
import StoreProvider, { useRootStore } from "../StoreProvider";
import Error from "../components/Error";
import VerificationNeeded from "../views/VerificationNeeded";

jest.mock("../utils/initIntercomSettings");
jest.mock("../utils/initFontAwesome");
jest.mock("../views/tenants/utils/i18nSettings");
jest.mock("../components/layouts/LanternLayout");
jest.mock("../components/layouts/CoreLayout");
jest.mock("../components/Revocations");
jest.mock("../views/tenants/us_nd/community/Goals");
jest.mock("../views/NotFound");
jest.mock("../components/Loading");
jest.mock("../StoreProvider");
jest.mock("../components/Error");
jest.mock("../views/VerificationNeeded");

describe("App tests", () => {
  const metadataField = `${METADATA_NAMESPACE}app_metadata`;

  const mockRevocationsId = "mo-community-revocations-id";
  const mockNDCommunityGoalsId = "nd-community-goals-id";
  const mockNotFoundId = "not-found-id";
  const mockLoadingTestId = "loading-test-id";
  const mockErrorId = "error-test-id";
  const mockVerificationNeededId = "verification-needed-test-id";

  const RevocationsMock = Revocations.type;
  const LanternLayoutMock = LanternLayout.type;

  LanternLayoutMock.mockImplementation(({ children }) => children);
  CoreLayout.mockImplementation(({ children }) => children);
  StoreProvider.mockImplementation(({ children }) => children);
  RevocationsMock.mockReturnValue(mockWithTestId(mockRevocationsId));
  UsNDCommunityGoals.mockReturnValue(mockWithTestId(mockNDCommunityGoalsId));
  NotFound.mockReturnValue(mockWithTestId(mockNotFoundId));
  Loading.mockReturnValue(mockWithTestId(mockLoadingTestId));
  Error.mockReturnValue(mockWithTestId(mockErrorId));
  VerificationNeeded.mockReturnValue(mockWithTestId(mockVerificationNeededId));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should render MO Layout with Revocations page", () => {
    window.history.pushState({}, "", "/community/revocations");
    const user = { [metadataField]: { state_code: US_MO } };
    useRootStore.mockReturnValue({
      userStore: { user, isAuthorized: true },
      currentTenantId: US_MO,
    });

    const { getByTestId } = render(<App />);

    expect(LanternLayoutMock).toHaveBeenCalledTimes(1);
    expect(getByTestId(mockRevocationsId)).toBeInTheDocument();
  });

  it("should render ND Layout with community goals page", () => {
    window.history.pushState({}, "", "/community/goals");
    const user = { [metadataField]: { state_code: US_ND } };

    useRootStore.mockReturnValue({
      userStore: { user, isAuthorized: true },
      currentTenantId: US_ND,
    });

    const { getByTestId } = render(<App />);

    expect(CoreLayout).toHaveBeenCalledTimes(1);
    expect(LanternLayoutMock).toHaveBeenCalledTimes(0);
    expect(getByTestId(mockNDCommunityGoalsId)).toBeInTheDocument();
  });

  it("should render PA Layout with Revocations page", () => {
    window.history.pushState({}, "", "/community/revocations");
    const user = { [metadataField]: { state_code: US_PA } };
    useRootStore.mockReturnValue({
      userStore: { user, isAuthorized: true },
      currentTenantId: US_PA,
    });

    const { getByTestId } = render(<App />);

    expect(LanternLayoutMock).toHaveBeenCalledTimes(1);
    expect(CoreLayout).toHaveBeenCalledTimes(0);
    expect(getByTestId(mockRevocationsId)).toBeInTheDocument();
  });

  describe("Not Found page", () => {
    it("should be rendered given an incorrect path", () => {
      window.history.pushState({}, "", "/some/page");
      useRootStore.mockReturnValue({
        userStore: { user: {}, isAuthorized: true },
        currentTenantId: US_PA,
      });

      const { container, getByTestId } = render(<App />);

      expect(container.children.length).toBe(1);
      expect(getByTestId(mockNotFoundId)).toBeInTheDocument();
    });

    it("should be rendered when the currentTenantId is not authorized for a layout", () => {
      window.history.pushState({}, "", "/some/page");
      useRootStore.mockReturnValue({
        userStore: { user: {}, isAuthorized: true },
        currentTenantId: "US_XX",
      });

      const { container, getByTestId } = render(<App />);

      expect(container.children.length).toBe(1);
      expect(getByTestId(mockNotFoundId)).toBeInTheDocument();
    });
  });

  it("should render Loading component while user is loading", () => {
    useRootStore.mockReturnValue({
      userStore: { user: {}, isLoading: true, authorize: () => {} },
    });

    const { container } = render(<App />);

    expect(container.children.length).toBe(1);
    expect(container.firstChild.dataset.testid).toBe(mockLoadingTestId);
  });

  it("should render the Error component if there is an error", () => {
    useRootStore.mockReturnValue({
      userStore: { isLoading: false, isAuthorized: false },
    });

    // do not log the expected error - keep tests less verbose
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByTestId } = render(<App />);

    expect(getByTestId(mockErrorId)).toBeInTheDocument();
  });

  it("should be render the Verification Needed component", () => {
    window.history.pushState({}, "", "/verify");
    useRootStore.mockReturnValue({
      userStore: { user: {}, isAuthorized: true },
      currentTenantId: US_PA,
    });

    const { container, getByTestId } = render(<App />);

    expect(container.children.length).toBe(1);
    expect(getByTestId(mockVerificationNeededId)).toBeInTheDocument();
  });
});
