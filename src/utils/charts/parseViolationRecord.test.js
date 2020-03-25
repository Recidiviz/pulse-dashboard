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
  test('handles multi-digit violation counts', () => {
    const rawInput = '1fel;13muni;400subs';
    const expectedOutput = '1 fel, 13 muni, 400 subs';
    expect(parseViolationRecord(rawInput)).toBe(expectedOutput);
  });
});
