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
import { renderHook } from "@testing-library/react-hooks";
import usePageLayout from "../usePageLayout";
import { StoreContext } from "../../StoreProvider";
import RootStore from "../../stores/RootStore";

jest.mock("../../react-auth0-spa");
jest.mock("../../utils/authentication/user");
global.scrollTo = jest.fn();

describe("usePageLayout hook tests", () => {
  let rootStore;
  let setIsTopBarShrinkingSpy;

  beforeEach(() => {
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => cb());

    const wrapper = ({ children }) => {
      rootStore = new RootStore();
      return (
        <StoreContext.Provider value={rootStore}>
          {children}
        </StoreContext.Provider>
      );
    };

    renderHook(() => usePageLayout(), {
      wrapper,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when pageStore.isTopBarShrinking is true", () => {
    beforeEach(() => {
      rootStore.pageStore.setIsTopBarShrinking(true);

      const { pageStore } = rootStore;
      setIsTopBarShrinkingSpy = jest.spyOn(pageStore, "setIsTopBarShrinking");
    });

    describe("when window.pageYOffset > 90", () => {
      it("isTopBarShrinking should not be changed", () => {
        window.pageYOffset = 100;
        global.dispatchEvent(new Event("scroll"));

        expect(setIsTopBarShrinkingSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("when window.pageYOffset < 5", () => {
      it("isTopBarShrinking should be set to false", () => {
        window.pageYOffset = 2;
        global.dispatchEvent(new Event("scroll"));

        expect(rootStore.pageStore.isTopBarShrinking).toBe(false);
        expect(setIsTopBarShrinkingSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when pageStore.isTopBarShrinking is false", () => {
    beforeEach(() => {
      rootStore.pageStore.setIsTopBarShrinking(false);

      const { pageStore } = rootStore;
      setIsTopBarShrinkingSpy = jest.spyOn(pageStore, "setIsTopBarShrinking");
    });

    describe("when window.pageYOffset > 90", () => {
      it("isTopBarShrinking should be set to true", () => {
        window.pageYOffset = 100;
        global.dispatchEvent(new Event("scroll"));

        expect(rootStore.pageStore.isTopBarShrinking).toBe(true);
        expect(setIsTopBarShrinkingSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when window.pageYOffset < 5", () => {
      it("isTopBarShrinking should not change", () => {
        window.pageYOffset = 2;
        global.dispatchEvent(new Event("scroll"));

        expect(setIsTopBarShrinkingSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when pageStore.isTopBarShrinking is changed in the store", () => {
    beforeEach(() => {
      rootStore.pageStore.setIsTopBarShrinking(true);

      const { pageStore } = rootStore;
      setIsTopBarShrinkingSpy = jest.spyOn(pageStore, "setIsTopBarShrinking");
    });

    it("triggers the effect to run", () => {
      window.pageYOffset = 100;
      expect(setIsTopBarShrinkingSpy).toHaveBeenCalledTimes(0);

      rootStore.pageStore.setIsTopBarShrinking(false);
      rootStore.pageStore.setIsTopBarShrinking(true);
      rootStore.pageStore.setIsTopBarShrinking(false);

      expect(setIsTopBarShrinkingSpy).toHaveBeenCalledTimes(3);
    });
  });
});
