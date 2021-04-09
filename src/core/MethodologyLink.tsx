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

import { Link } from "react-router-dom";
import { Icon, IconSVG } from "@recidiviz/case-triage-components";

import "./MethodologyLink.scss";
import * as styles from "./CoreConstants.scss";

const MethodologyLink: React.FC<{ path: string }> = ({ path }) => {
  return (
    <Link className="MethodologyLink" to={path}>
      <Icon
        className="MethodologyLink__icon"
        kind={IconSVG.Open}
        width={12}
        height={12}
        fill={styles.signalLinks}
      />
      Methodology
    </Link>
  );
};

export default MethodologyLink;
