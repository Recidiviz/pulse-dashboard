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

const monthNamesShortWithYearsFromNumberList = function monthNamesShortWithYearsFromNumberList(
  numberList,
) {
  const monthNames = monthNamesShortFromNumberList(numberList);

  if (numberList.length > 12 || numberList[numberList.length - 1] < numberList[0]) {
    const today = new Date();
    let year = today.getFullYear();

    for (let i = numberList.length - 1; i >= 0; i -= 1) {
      if (numberList[i] === 1) {
        monthNames[i] = monthNames[i].concat(" '", year % 100);
        year -= 1;
      } else if (i === 0) {
        monthNames[i] = monthNames[i].concat(" '", year % 100);
      }
    }
  }
  return monthNames;
};

const monthNamesFromShortName = function monthNamesFromShortName(shortName) {
  return MONTH_NAMES[MONTH_NAMES_SHORT.indexOf(shortName)];
};

export {
  monthNameFromNumber,
  monthNameShortFromNumber,
  monthNamesShortFromNumberList,
  monthNamesShortWithYearsFromNumberList,
  monthNamesFromShortName,
};
