// eslint-disable-next-line no-nested-ternary
export default process.env.REACT_APP_DEPLOY_ENV === "production"
  ? {
      // TODO(395): Set to true when we have debugged the issues with the exit rate calculations
      enableRevocationRateByExit: false,
      enableCoreTabNavigation: true,
      enableVitalsDashboard: false,
      enableVitalsOfficerView: false,
    }
  : process.env.REACT_APP_DEPLOY_ENV === "staging"
  ? {
      enableRevocationRateByExit: false,
      enableCoreTabNavigation: true,
      enableVitalsDashboard: true,
      enableVitalsOfficerView: true,
    }
  : {
      // Development
      enableRevocationRateByExit: false,
      enableCoreTabNavigation: true,
      enableVitalsDashboard: true,
      enableVitalsOfficerView: true,
    };
