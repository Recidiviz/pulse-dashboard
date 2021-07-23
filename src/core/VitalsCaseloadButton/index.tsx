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

import "./VitalsCaseloadButton.scss";

import { Button, Icon, IconSVG } from "@recidiviz/case-triage-components";
import { observer } from "mobx-react-lite";
import React from "react";

import {
  generateEmailAddress,
  getFirstName,
  toPossessive,
} from "../../utils/formatStrings";
import * as styles from "../CoreConstants.scss";
import { useCoreStore } from "../CoreStoreProvider";
import { ENTITY_TYPES } from "../models/types";

const VitalsCaseloadButton: React.FC = () => {
  const { pageVitalsStore, tenantStore } = useCoreStore();
  const { currentEntitySummary } = pageVitalsStore;
  if (
    !currentEntitySummary ||
    currentEntitySummary.entityType !== ENTITY_TYPES.PO
  )
    return <div />;

  const { entityName, entityId } = currentEntitySummary;
  const firstName = getFirstName(entityName);
  const officerEmailAddress = generateEmailAddress(
    entityId,
    tenantStore.domain
  );

  return (
    <div className="VitalsCaseloadButton__button">
      <Button
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_CASE_TRIAGE_URL}/impersonate_user?impersonated_email=${officerEmailAddress}`;
        }}
      >
        View {toPossessive(firstName)} caseload
        <Icon
          className="VitalsCaseloadButton__icon"
          kind={IconSVG.Open}
          fill={styles.white}
        />
      </Button>
    </div>
  );
};
export default observer(VitalsCaseloadButton);
