const fontStyles = {
  color: "rgba(114, 119, 122, 0.8)",
  textTransform: "uppercase",
};

export default {
  container: (base) => ({
    ...base,
    flexGrow: 1,
  }),
  option: (base, state) => ({
    ...base,
    ...fontStyles,
    color: state.isSelected ? "#fff" : fontStyles.color,
  }),
  singleValue: (base) => ({ ...base, ...fontStyles }),
  group: (base) => ({ ...base, ...fontStyles, marginLeft: 20 }),
};
