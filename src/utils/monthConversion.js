const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_ABBREVIATED = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const monthNameFromNumber = function monthNameFromNumber(number) {
  return MONTH_NAMES[number - 1];
};

const monthNameFromNumberAbbreviated = function monthNameShortFromNumber(number) {
  return MONTH_NAMES_ABBREVIATED[number - 1];
};

const monthNamesFromNumbers = function monthNamesFromNumbers(
  monthNumbers, abbreviated,
) {
  const monthList = [];
  const namesArray = abbreviated ? MONTH_NAMES_ABBREVIATED : MONTH_NAMES;

  monthNumbers.forEach((month) => {
    monthList.push(namesArray[month - 1]);
  });

  return monthList;
};

const monthNamesWithYearsFromNumbers = function monthNamesShortWithYearsFromNumbers(
  monthNumbers, abbreviated,
) {
  const monthNames = monthNamesFromNumbers(monthNumbers, abbreviated);
  const multipleYears = (monthNumbers.length > 12
    || monthNumbers[monthNumbers.length - 1] < monthNumbers[0]);
  const january = abbreviated ? 'Jan' : 'January';

  const today = new Date();
  let year = today.getFullYear();

  for (let i = monthNumbers.length - 1; i >= 0; i -= 1) {
    if (i === 0) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
    } else if (multipleYears && monthNames[i] === january) {
      monthNames[i] = monthNames[i].concat(" '", year % 100);
      year -= 1;
    }
  }
  return monthNames;
};

const monthNamesFromShortName = function monthNamesFromShortName(shortName) {
  if (shortName) {
    let monthName = shortName;

    // Strip the year ('XX) from the name if it exists
    if (shortName.includes("'")) {
      monthName = shortName.substring(0, shortName.indexOf("'") - 1);
    }

    return MONTH_NAMES[MONTH_NAMES_ABBREVIATED.indexOf(monthName)];
  }

  return '';
};

export {
  monthNameFromNumber,
  monthNameFromNumberAbbreviated,
  monthNamesFromNumbers,
  monthNamesWithYearsFromNumbers,
  monthNamesFromShortName,
};
