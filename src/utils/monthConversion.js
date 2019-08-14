const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const monthNameFromNumber = function monthNameFromNumber(number) {
  return MONTH_NAMES[number - 1];
};

const monthNameShortFromNumber = function monthNameShortFromNumber(number) {
  return MONTH_NAMES_SHORT[number - 1];
};

const monthNamesShortFromNumberList = function monthNamesShortFromNumberList(
  numberList,
) {
  const monthList = [];

  numberList.forEach((number) => {
    monthList.push(MONTH_NAMES_SHORT[number - 1]);
  });

  return monthList;
};

const monthNamesFromShortName = function monthNamesFromShortName(shortName) {
  return MONTH_NAMES[MONTH_NAMES_SHORT.indexOf(shortName)];
};

export {
  monthNameFromNumber,
  monthNameShortFromNumber,
  monthNamesShortFromNumberList,
  monthNamesFromShortName,
};
