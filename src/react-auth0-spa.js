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

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

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

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const newUser = await auth0Client.getUser();
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const newUser = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(newUser);
  };

  const contextValue = {
    isAuthenticated,
    user,
    loading,
    popupOpen,
    loginWithPopup,
    handleRedirectCallback,
    getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
    getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
    getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
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
