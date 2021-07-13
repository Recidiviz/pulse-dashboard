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

import { renderHook } from "@testing-library/react-hooks";

import { useRootStore } from "../../components/StoreProvider";
import useIntercom from "../useIntercom";

jest.mock("../../components/StoreProvider");

describe("useIntercom hook tests", () => {
  const mockName = "some user name";
  const mockNickname = "some user nickname";
  const mockEmail = "some user email";
  const mockUserId = "some user id";
  const mockStateCode = "some state code";
  const mockUser = {
    name: mockName,
    nickname: mockNickname,
    email: mockEmail,
    sub: mockUserId,
  };

  useRootStore.mockReturnValue({
    userStore: { user: mockUser },
    tenantStore: { currentTenantId: mockStateCode },
  });

  const intercom = jest.fn();
  window.Intercom = intercom;

  const { rerender, unmount } = renderHook(() => useIntercom());

  it("should update intercom with user data", () => {
    expect(intercom).toHaveBeenCalledTimes(1);
    expect(intercom.mock.calls[0]).toEqual([
      "update",
      {
        state_code: mockStateCode,
        name: mockName,
        nickname: mockNickname,
        email: mockEmail,
        user_id: mockUserId,
        hide_default_launcher: false,
      },
    ]);
  });

  it("should update intercom if user data changed", () => {
    const mockNewName = "some new user name";
    mockUser.name = mockNewName;

    useRootStore.mockReturnValue({
      userStore: { user: mockUser },
      tenantStore: { currentTenantId: mockStateCode },
    });

    rerender();

    expect(intercom).toHaveBeenCalledTimes(2);
    expect(intercom.mock.calls[1]).toEqual([
      "update",
      {
        state_code: mockStateCode,
        name: mockNewName,
        nickname: mockNickname,
        email: mockEmail,
        user_id: mockUserId,
        hide_default_launcher: false,
      },
    ]);
  });

  it("should hide intercom on unmount", () => {
    unmount();

    expect(intercom).toHaveBeenCalledTimes(3);
    expect(intercom.mock.calls[2]).toEqual([
      "update",
      {
        hide_default_launcher: true,
      },
    ]);
  });
});
