const fontStyles = {
  color: "rgba(114, 119, 122, 0.8)",
  textTransform: "uppercase",
};

export default {
  option: (base, state) => ({
    ...base,
    ...fontStyles,
    backgroundColor: state.isMulti ? "transparent" : base.backgroundColor,
    "&:active": {
      backgroundColor: state.isMulti ? "transparent" : base.backgroundColor,
    },
  }),
  singleValue: (base) => ({ ...base, ...fontStyles }),
  group: (base) => ({ ...base, ...fontStyles, marginLeft: 20 }),
};
