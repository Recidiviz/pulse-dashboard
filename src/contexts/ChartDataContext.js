import React, { createContext, useContext, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";

import { useStateCode } from "./StateCodeContext";

const CACHE_LIFETIME = 300000;
const ChartDataContext = createContext({});

/*
Map({
  [tenantName]: Map({
    [fileName]: {
      date: instance of `moment`
      data: data
    }
  })
})
 */
const apiCache = new Map();

export const ChartDataProvider = ({ children }) => {
  const { currentStateCode } = useStateCode();

  useEffect(() => {
    apiCache.forEach((tenant) => {
      tenant.forEach((file) => {
        clearTimeout(file.timeout);
      });
    });
    apiCache.clear();
  }, [currentStateCode]);

  const getFile = (tenantName, fileName) => {
    const tenant = apiCache.get(tenantName);
    if (!tenant) return null;

    const file = tenant.get(fileName);
    if (!file) return null;

    if (moment().diff(file.date) > CACHE_LIFETIME) return null;

    return file.data;
  };

  const removeFile = (tenantName, fileName) => {
    const tenant = apiCache.get(tenantName);
    if (tenant) {
      tenant.delete(fileName);
    }
  };

  const setFile = (tenantName, fileName, data) => {
    const timeout = setTimeout(() => {
      removeFile(tenantName, fileName);
    }, CACHE_LIFETIME);
    const file = { date: moment(), data, timeout };

    const tenant = apiCache.get(tenantName);
    if (!tenant) {
      apiCache.set(tenantName, new Map().set(fileName, file));
    } else {
      tenant.set(fileName, file);
    }
  };

  const contextValue = { getCachedFile: getFile, setCachedFile: setFile };

  return (
    <ChartDataContext.Provider value={contextValue}>
      {children}
    </ChartDataContext.Provider>
  );
};

ChartDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCachedChartData = () => useContext(ChartDataContext);
