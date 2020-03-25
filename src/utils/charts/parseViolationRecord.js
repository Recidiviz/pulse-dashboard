const VIOLATION_SEVERITY = [
  'fel', 'misd', 'absc', 'muni', 'subs', 'tech',
];

const indexOf = (element, array) => {
  for (let i = 0; i < array.length; i += 1) {
    if (element === array[i]) {
      return i;
    }
  }
  return -1;
};

const parseViolationRecord = (recordLabel) => {
  if (!recordLabel) {
    return '';
  }

  const recordParts = recordLabel.split(';');
  const recordPartRegex = /(?<number>\d+)(?<abbreviation>\w+)/;
  const records = recordParts.map((recordPart) => recordPart.match(recordPartRegex).groups);
  records.sort((a, b) => indexOf(a.abbreviation, VIOLATION_SEVERITY)
    - indexOf(b.abbreviation, VIOLATION_SEVERITY));

  return records.map((record) => `${record.number} ${record.abbreviation}`).join(', ');
};

export default parseViolationRecord;
