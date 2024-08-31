import { Log } from '.';

describe('Log', () => {
  it('should parse the log string correctly', () => {
    const logString =
      '127.0.0.1 - - [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326';
    const log = new Log(logString);

    expect(log.ip).toBe('127.0.0.1');
    expect(log.timeString).toBe('[10/Oct/2000:13:55:36 -0700]');
    expect(log.url).toBe('/apache_pb.gif');
  });

  it('should return a valid Date object from getTime', () => {
    const logString =
      '127.0.0.1 - - [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326';
    const log = new Log(logString);
    const date = log.getTime();

    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2000);
    expect(date?.getMonth()).toBe(9); // Months are zero-indexed in JavaScript
    expect(date?.getDate()).toBe(10);
    expect(date?.getHours()).toBe(13);
    expect(date?.getMinutes()).toBe(55);
    expect(date?.getSeconds()).toBe(36);
  });

  it('should return null for getTime if timeString is null', () => {
    const log = new Log('');
    log.timeString = null;

    expect(log.getTime()).toBeNull();
  });

  it('should handle invalid log strings gracefully', () => {
    const logString = 'invalid log string';
    const log = new Log(logString);

    expect(log.ip).toBe('invalid');
    expect(log.timeString).toBeNull();
    expect(log.url).toBeNull();
  });
});
