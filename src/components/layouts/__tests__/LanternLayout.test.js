import React from "react";
import { render } from "@testing-library/react";
import LanternLayout from "../LanternLayout";
import useIntercom from "../../../hooks/useIntercom";
import usePageLayout from "../../../hooks/usePageLayout";
import TopBarUserMenuForAuthenticatedUser from "../../topbar/TopBarUserMenuForAuthenticatedUser";
import mockWithTestId from "../../../../__helpers__/mockWithTestId";
import StoreProvider, { useRootStore } from "../../../StoreProvider";
import { US_MO } from "../../../RootStore/TenantStore/lanternTenants";
import { PageProvider } from "../../../contexts/PageContext";

jest.mock("react-router-dom");
jest.mock("../../../hooks/useIntercom");
jest.mock("../../../hooks/usePageLayout");
jest.mock("../../topbar/TopBarUserMenuForAuthenticatedUser");
jest.mock("../../../StoreProvider");

describe("LanternLayout tests", () => {
  TopBarUserMenuForAuthenticatedUser.mockReturnValue(null);
  const mockChildrenId = "children-test-id";
  const mockChildren = mockWithTestId(mockChildrenId);
  StoreProvider.mockImplementation(({ children }) => children);
  let result;

  beforeEach(() => {
    useRootStore.mockReturnValue({
      currentTenantId: US_MO,
    });
    result = render(
      <PageProvider>
        <StoreProvider>
          <LanternLayout>{mockChildren}</LanternLayout>
        </StoreProvider>
      </PageProvider>
    );
  });

  it("should render children", () => {
    expect(result.getByTestId(mockChildrenId)).toBeInTheDocument();
  });

  it("should use Intercom for Lantern layout", () => {
    expect(useIntercom).toHaveBeenCalled();
  });

  it("should use Page Layout hook", () => {
    expect(usePageLayout).toHaveBeenCalled();
  });
});
