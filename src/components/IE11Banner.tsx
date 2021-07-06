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
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { useRootStore } from "./StoreProvider/StoreProvider";
import "./IE11Banner.scss";

interface Props {
  lantern?: boolean;
}

const IE11Banner: React.FC<Props> = ({ lantern = false }) => {
  const { pageStore } = useRootStore();
  return (
    <div className={cn("IE11Banner", { Lantern: lantern })}>
      <div
        className={cn("IE11Banner__container", {
          "IE11Banner__container--visible": pageStore.ie11BannerIsVisible,
        })}
      >
        <div className="IE11Banner__body">
          <div className="IE11Banner__body--text">
            Looks like you’re using Internet Explorer 11. For faster loading and
            a better experience, use Microsoft Edge, Google Chrome, or Firefox.
          </div>
          <div className="IE11Banner__body--close">
            <button
              type="button"
              className="close"
              onClick={pageStore.hideIE11Banner}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(IE11Banner);
