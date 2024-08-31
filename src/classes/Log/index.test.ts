import { Log } from '.';

describe('Log', () => {
  it('should parse the log string correctly', () => {
    const logString =
      '50.112.00.11 - admin [11/Jul/2018:17:33:01 +0200] "GET /asset.css HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"';
    const log = new Log(logString);

    expect(log.ip).toBe('50.112.00.11');
    expect(log.timeString).toBe('11/Jul/2018:17:33:01 +0200');
    expect(log.url).toBe('/asset.css');
  });

  it('should return a valid Date object from getTime', () => {
    const logString =
      '50.112.00.11 - admin [11/Jul/2018:17:33:01 +0200] "GET /asset.css HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"';
    const log = new Log(logString);
    const date = log.getTime();

    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2018);
    expect(date?.getMonth()).toBe(6); // Months are zero-indexed in JavaScript
    expect(date?.getDate()).toBe(11);
    expect(date?.getHours()).toBe(17);
    expect(date?.getMinutes()).toBe(33);
    expect(date?.getSeconds()).toBe(1);
  });

  it('should work for ipv6 addresses', () => {
    const logString =
      '2001:0db8:85a3:0000:0000:8a2e:0370:7334 - admin [11/Jul/2018:17:33:01 +0200] "GET /asset.css HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"';
    const log = new Log(logString);

    expect(log.ip).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
  });

  it('should return null for getTime if timeString is null', () => {
    const log = new Log('');
    log.timeString = null;

    expect(log.getTime()).toBeNull();
  });

  it('should handle invalid log strings gracefully', () => {
    const logString = 'invalid log string';
    const log = new Log(logString);

    expect(log.ip).toBeNull();
    expect(log.timeString).toBeNull();
    expect(log.url).toBeNull();
  });
});
