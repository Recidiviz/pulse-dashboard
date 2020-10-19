const getDenominatorKeyByMode = (mode) => {
  switch (mode) {
    case "rates":
    default:
      return "total_supervision_count";
    case "exits":
      return "total_exit_count";
  }
};

export default getDenominatorKeyByMode;
