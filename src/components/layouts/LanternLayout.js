import React from "react";
import PropTypes from "prop-types";

import { useAuth0 } from "../../react-auth0-spa";
import { enableIntercomLauncherForUser } from "../../utils/intercomSettings";
import { setTranslateLocale } from "../../views/tenants/utils/i18nSettings";
import TopBar from "../topbar/TopBar";
import TopBarLogo from "../topbar/TopBarLogo";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";

const Layout = ({ children, stateCode }) => {
  const { user } = useAuth0();
  enableIntercomLauncherForUser(user);
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
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default Layout;
