import parseViolationRecord from './parseViolationRecord';

describe('parseViolationRecord function', () => {
  test('reformats semicolon-separated strings', () => {
    const rawInput = '1fel;1muni;4subs;3tech';
    const expectedOutput = '1 fel, 1 muni, 4 subs, 3 tech';
    expect(parseViolationRecord(rawInput)).toBe(expectedOutput);
  });
  test('returns a string even when there is no input', () => {
    expect(parseViolationRecord()).toBe('');
    expect(parseViolationRecord('')).toBe('');
    expect(parseViolationRecord(null)).toBe('');
  });
  test.todo('handles multi-digit violation counts');
});
