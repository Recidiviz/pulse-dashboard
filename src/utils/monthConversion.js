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
  const multipleYears = (numberList.length > 12
    || numberList[numberList.length - 1] < numberList[0]);

  const today = new Date();
  let year = today.getFullYear();

  for (let i = numberList.length - 1; i >= 0; i -= 1) {
    if (i === 0) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
    } else if (multipleYears && numberList[i] === 1) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
      year -= 1;
    }
  }
  return monthNames;
};

const addYearsToMonthNamesShort = function addYearsToMonthNamesShort(
  monthList,
) {
  const newMonthList = monthList;

  const indexLastMonth = MONTH_NAMES_SHORT.indexOf(monthList[monthList.length - 1]);
  const indexFirstMonth = MONTH_NAMES_SHORT.indexOf(monthList[0]);
  const multipleYears = (monthList.length > 12 || indexLastMonth < indexFirstMonth);

  const today = new Date();
  let year = today.getFullYear();

  for (let i = monthList.length - 1; i >= 0; i -= 1) {
    if (i === 0) {
      newMonthList[i] = monthList[i].concat(" '", year % 100);
    } else if (multipleYears && monthList[i] === 'Jan') {
      newMonthList[i] = monthList[i].concat(" '", year % 100);
      year -= 1;
    }
  }
  return newMonthList;
};

const monthNamesFromShortName = function monthNamesFromShortName(shortName) {
  return MONTH_NAMES[MONTH_NAMES_SHORT.indexOf(shortName)];
};

export {
  addYearsToMonthNamesShort,
  monthNameFromNumber,
  monthNameShortFromNumber,
  monthNamesShortFromNumberList,
  monthNamesShortWithYearsFromNumberList,
  monthNamesFromShortName,
};
