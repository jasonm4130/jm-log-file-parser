import { Parser, Log } from '../classes';
import { calculateTopValues } from './calculateTopValues';

jest.mock('../classes');

describe('calculateTopValues', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
    parser.logs = [
      { url: 'http://example.com', ip: '192.168.0.2' } as Log,
      { url: 'http://example.com', ip: '192.168.0.1' } as Log,
      { url: 'http://example.com', ip: '192.168.0.2' } as Log,
      { url: 'http://example.org', ip: '192.168.0.1' } as Log,
      { url: 'http://example.org', ip: '192.168.0.3' } as Log,
      { url: 'http://example.com', ip: '192.168.0.2' } as Log,
      { url: 'http://example.net', ip: '192.168.0.1' } as Log,
      { url: 'http://example.org', ip: '192.168.0.3' } as Log,
      { url: 'http://example.net', ip: '192.168.0.1' } as Log,
    ];
  });

  it('should return the top URLs', () => {
    const result = calculateTopValues.call(parser, 'url');
    expect(result).toEqual([
      'http://example.com',
      'http://example.org',
      'http://example.net',
    ]);
  });

  it('should return the top IPs', () => {
    const result = calculateTopValues.call(parser, 'ip');
    expect(result).toEqual(['192.168.0.1', '192.168.0.2', '192.168.0.3']);
  });

  it('should return an empty array if no logs are present', () => {
    parser.logs = [];
    const result = calculateTopValues.call(parser, 'url');
    expect(result).toEqual([]);
  });

  it('should handle logs with missing keys gracefully', () => {
    parser.logs = [
      { url: 'http://example.com' } as Log,
      { ip: '192.168.0.1' } as Log,
      { url: 'http://example.org', ip: '192.168.0.2' } as Log,
    ];
    const result = calculateTopValues.call(parser, 'url');
    expect(result).toEqual(['http://example.com', 'http://example.org']);
  });

  it('should handle logs with duplicate values correctly', () => {
    parser.logs = [
      { url: 'http://example.com', ip: '192.168.0.1' } as Log,
      { url: 'http://example.com', ip: '192.168.0.1' } as Log,
      { url: 'http://example.org', ip: '192.168.0.2' } as Log,
    ];
    const result = calculateTopValues.call(parser, 'url');
    expect(result).toEqual(['http://example.com', 'http://example.org']);
  });
});
