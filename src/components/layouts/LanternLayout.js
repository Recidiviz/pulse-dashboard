import React from "react";
import PropTypes from "prop-types";

import TopBar from "../topbar/TopBar";
import TopBarLogo from "../topbar/TopBarLogo";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";
import usePageLayout from "../../hooks/usePageLayout";
import useIntercom from "../../hooks/useIntercom";

const LanternLayout = ({ children }) => {
  useIntercom();
  usePageLayout();

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
};

export default LanternLayout;
