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
import { observer } from "mobx-react-lite";
import HTMLReactParser from "html-react-parser";
import { Container } from "reactstrap";
import ScrollableAnchor from "react-scrollable-anchor";

import content from "../content";
import { MethodologyContent } from "../models/types";
import PageTemplate from "../PageTemplate";
import { useRootStore } from "../../components/StoreProvider";
import { convertToSlug } from "../../utils/navigation";

import "../ProjectionsMethodology/Methodology.scss";

const VitalsMethodology: React.FC = () => {
  const { currentTenantId } = useRootStore();
  // @ts-ignore TODO TS
  const { vitals: vitalsMethodology } = content[currentTenantId];

  return (
    <PageTemplate>
      <div className="Methodology">
        <Container className="col-md-9 col-12">
          <h1 className="Methodology__main-title">{vitalsMethodology.title}</h1>
          <h2 className="Methodology__main-description">
            {vitalsMethodology.description}
          </h2>
          <div className=" Methodology__toc col-md-5 col-12">
            <h5 className="Methodology__toc--header">CONTENTS</h5>
            <div className="d-flex flex-column">
              {vitalsMethodology.content.map(
                (contentBlock: MethodologyContent) => (
                  <a
                    className="Methodology__toc--link"
                    key={`link${contentBlock.heading}`}
                    href={`#${convertToSlug(contentBlock.heading)}`}
                  >
                    {contentBlock.heading}
                  </a>
                )
              )}
            </div>
          </div>
          <div>
            {vitalsMethodology.content.map(
              (contentBlock: MethodologyContent) => {
                return (
                  <ScrollableAnchor id={convertToSlug(contentBlock.heading)}>
                    <div className="Methodology__block">
                      <h3 className="Methodology__block--title ">
                        {contentBlock.heading}
                      </h3>
                      <hr />
                      <>{HTMLReactParser(contentBlock.content)}</>
                    </div>
                  </ScrollableAnchor>
                );
              }
            )}
          </div>
        </Container>
      </div>
    </PageTemplate>
  );
};
export default observer(VitalsMethodology);
