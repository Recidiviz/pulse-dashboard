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

import { Icon, IconSVG } from "@recidiviz/case-triage-components";
import "./DetailsGroup.scss";
import * as styles from "./CoreConstants.scss";

interface PropTypes {
  handleOnClick: () => Promise<void>;
}

const DownloadDataButton: React.FC<PropTypes> = ({ handleOnClick }) => {
  return (
    <button
      className="btn btn-link DetailsGroup__button"
      id="downloadChartData"
      type="button"
      aria-expanded="true"
      aria-controls="importantNotes"
      onClick={handleOnClick}
    >
      <Icon
        className="DetailsGroup__icon"
        kind={IconSVG.Open}
        fill={styles.signalLinks}
      />
      Download Data
    </button>
  );
};

export default DownloadDataButton;
