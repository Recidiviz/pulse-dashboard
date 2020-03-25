const VIOLATION_SEVERITY = [
  'fel', 'misd', 'absc', 'muni', 'subs', 'tech',
];

const parseViolationRecord = (recordLabel) => {
  if (!recordLabel) {
    return '';
  }

  const recordParts = recordLabel.split(';');
  const recordPartRegex = /(?<number>\d+)(?<abbreviation>\w+)/;
  const records = recordParts.map((recordPart) => recordPart.match(recordPartRegex).groups);
  records.sort((a, b) => VIOLATION_SEVERITY.indexOf(a.abbreviation)
    - VIOLATION_SEVERITY.indexOf(b.abbreviation));

  return records.map((record) => `${record.number} ${record.abbreviation}`).join(', ');
};

export default parseViolationRecord;
