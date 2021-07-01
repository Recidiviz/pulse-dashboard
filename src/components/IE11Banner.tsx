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

import React, { useState } from "react";
import styled from "styled-components/macro";
import * as fontStyles from "../core/CoreConstants.scss";

const BannerContainer = styled.div`
  padding-top: 5rem;
  padding-bottom: 0.5rem;
`;

const Banner = styled.div<{ hidden: boolean }>`
  height: 72px;
  background-color: ${fontStyles.pine3};
  padding: 0 10rem 0;
  display: ${(props) => (props.hidden ? "false" : "flex")};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BannerText = styled.div`
  color: ${fontStyles.white};
  font: ${fontStyles.fontUiSans16};
  line-height: 24px;
`;

const BannerClose = styled.div`
  .close {
    line-height: 12px;
    color: ${fontStyles.white};
    span {
      font-size: 30px;
    }
  }
`;

const IE11Banner: React.FC = () => {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <BannerContainer>
      <Banner hidden={isHidden}>
        <BannerText>
          Looks like you’re using Internet Explorer 11. For faster loading and a
          better experience, use Microsoft Edge, Google Chrome, or Firefox.
        </BannerText>
        <BannerClose>
          <button
            type="button"
            className="close"
            onClick={() => setIsHidden(true)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </BannerClose>
      </Banner>
    </BannerContainer>
  );
};

export default IE11Banner;
