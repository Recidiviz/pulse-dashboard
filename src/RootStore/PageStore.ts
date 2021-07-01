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
import { makeAutoObservable } from "mobx";
import type RootStore from ".";

const IE_11_BANNER_VISIBLE = "ie11BannerIsVisibleInSession";

export default class PageStore {
  isIE11: boolean;

  ie11BannerIsVisible: boolean;

  hideTopBar: boolean;

  constructor({ rootStore }: { rootStore: typeof RootStore }) {
    makeAutoObservable(this);

    this.isIE11 = window.navigator.userAgent.indexOf("Trident/") > 0;
    const storageIsVisible =
      sessionStorage.getItem(IE_11_BANNER_VISIBLE) || "true";
    this.ie11BannerIsVisible = storageIsVisible === "true" && this.isIE11;

    this.hideTopBar = false;
  }

  hideIE11Banner = (): void => {
    this.ie11BannerIsVisible = false;
    sessionStorage.setItem(IE_11_BANNER_VISIBLE, "false");
  };

  setHideTopBar = (value: boolean): void => {
    this.hideTopBar = value;
  };
}
