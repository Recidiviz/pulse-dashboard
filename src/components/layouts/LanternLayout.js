import React from "react";
import PropTypes from "prop-types";

import TopBar from "../topbar/TopBar";
import TopBarLogo from "../topbar/TopBarLogo";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";
import usePageLayout from "../../hooks/usePageLayout";
import useIntercom from "../../hooks/useIntercom";
import { setTranslateLocale } from "../../views/tenants/utils/i18nSettings";

const LanternLayout = ({ stateCode, children }) => {
  useIntercom();
  usePageLayout();
  setTranslateLocale(stateCode);

  return (
    <div id="app">
      <div className="wide-page-container">
        <TopBar isWide>
          <TopBarLogo />
          <ul className="nav-right">
            <TopBarUserMenuForAuthenticatedUser />
          </ul>
        </TopBar>
        {children}
        <Footer />
      </div>
    </div>
  );
};

LanternLayout.propTypes = {
  children: PropTypes.node.isRequired,
  stateCode: PropTypes.string.isRequired,
};

export default LanternLayout;
