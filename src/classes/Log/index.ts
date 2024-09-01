import { ClassProperties } from '../../types';

export type LogProperties = ClassProperties<Log>;

export class Log {
  ip: string | null;
  timeString: string | null;
  url: string | null;

  constructor(log: string) {
    // The log line looks like:
    // 50.112.00.11 - admin [11/Jul/2018:17:33:01 +0200] "GET /asset.css HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"
    // Regex to match the ip portion of the log line (ipv4 and ipv6)
    const regex =
      /(?<ip>(?:\d{1,3}\.){3}\d{1,3}|[0-9a-fA-F:]+) - (?<userName>.+) \[(?<timestamp>\d{2}\/\w{3}\/\d{4}:?\d{2}:\d{2}:\d{2} \+?\d{4})\] "(?<method>GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH|) (?<path>\S+) (?<protocol>\S+)" (?<statusCode>\d{3}) (?<bytes>\d+) "(?<referrer>.+)" "(?<userAgent>.+)"$/;
    const match = log.match(regex);

    this.ip = match?.groups?.ip || null;
    this.timeString = match?.groups?.timestamp || null;
    this.url = match?.groups?.path || null;
  }

  getTime() {
    if (!this.timeString) {
      return null;
    }

    // The time string looks like this: 09/Jul/2018:15:48:20 +0200
    const [day, month, year, hour, minute, second] =
      this.timeString.split(/[:/ ]/);

    return new Date(
      parseInt(year, 10),
      this.getMonthIndex(month),
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10),
    );
  }

  private getMonthIndex(month: string) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months.indexOf(month);
  }
}
