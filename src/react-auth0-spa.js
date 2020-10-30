import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import PropTypes from "prop-types";
import isDemoMode from "./utils/authentication/demoMode";
import { getDemoUser } from "./utils/authentication/viewAuthentication";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

const overrideIfDemoMode = (Auth0ContextValue) => {
  if (isDemoMode()) {
    Object.assign(Auth0ContextValue, {
      isAuthenticated: true,
      user: getDemoUser(),
      getTokenSilently: () => "",
    });
  }
};

const Auth0Context = React.createContext({});
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [auth0Client, setAuth0] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isUserAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isUserAuthenticated);

      if (isUserAuthenticated) {
        const newUser = await auth0FromHook.getUser();
        setUser(newUser);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const contextValue = {
    isAuthenticated,
    user,
    loading,
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
    getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
    logout: (...p) => auth0Client.logout(...p),
  };

  overrideIfDemoMode(contextValue);

  return (
    <Auth0Context.Provider value={contextValue}>
      {children}
    </Auth0Context.Provider>
  );
};

Auth0Provider.propTypes = {
  children: PropTypes.node.isRequired,
  onRedirectCallback: PropTypes.func.isRequired,
};
