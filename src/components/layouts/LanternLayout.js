import React from "react";
import PropTypes from "prop-types";

import { useAuth0 } from "../../react-auth0-spa";
import { enableIntercomLauncherForUser } from "../../utils/intercomSettings";
import TopBar from "../topbar/TopBar";
import TopBarLogo from "../topbar/TopBarLogo";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";
import usePageLayout from "../../hooks/usePageLayout";
import { setTranslateLocale } from "../../views/tenants/utils/i18nSettings";

const Layout = ({ stateCode, children }) => {
  const { user } = useAuth0();
  enableIntercomLauncherForUser(user);
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

Layout.propTypes = {
  stateCode: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default Layout;
