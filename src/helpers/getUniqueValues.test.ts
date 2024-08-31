import { Parser, Log, LogProperties } from '../classes';
import { getUniqueValues } from './getUniqueValues';

jest.mock('../classes');

describe('getUniqueValues', () => {
  let parser: Parser;

  beforeEach(() => {
    jest.clearAllMocks();
    parser = new Parser();
    parser.logs = [
      { url: 'http://example.com', ip: '192.168.0.1' },
      { url: 'http://example.com', ip: '192.168.0.2' },
      { url: 'http://example.org', ip: '192.168.0.3' },
      { url: 'http://example.org', ip: '192.168.0.1' },
      { url: 'http://example.com', ip: '192.168.0.2' },
    ] as Log[];
  });

  it('should return the number of unique values for a given key', () => {
    const uniqueUrls = getUniqueValues.call(parser, 'url');
    expect(uniqueUrls).toBe(2);

    const uniqueIPs = getUniqueValues.call(parser, 'ip');
    expect(uniqueIPs).toBe(3);
  });

  it('should return 0 if there are no logs', () => {
    parser.logs = [];
    const uniqueUrls = getUniqueValues.call(parser, 'url');
    expect(uniqueUrls).toBe(0);
  });

  it('should return 0 if the key does not exist in logs', () => {
    const uniqueNonExistentKey = getUniqueValues.call(
      parser,
      'nonExistentKey' as keyof LogProperties,
    );
    expect(uniqueNonExistentKey).toBe(0);
  });

  it('should handle logs with undefined values for the given key', () => {
    parser.logs.push({ url: undefined, ip: '192.168.0.1' } as unknown as Log);
    const uniqueUrls = getUniqueValues.call(parser, 'url');
    expect(uniqueUrls).toBe(2);
  });
});
