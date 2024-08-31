import { ClassProperties } from '../../types';

export type LogProperties = ClassProperties<Log>;

export class Log {
  ip: string | null;
  timeString: string | null;
  url: string | null;

  constructor(log: string) {
    const parts = log.split(' ');
    this.ip = parts[0] || null;
    if (parts[3] && parts[4]) {
      this.timeString = parts[3] + ' ' + parts[4];
    } else {
      this.timeString = null;
    }
    this.url = parts[6] || null;
  }

  getTime() {
    if (!this.timeString) {
      return null;
    }

    const formattedString = this.timeString
      .replace(/[[\]-]/g, '')
      .replace(/[/]/g, ' ')
      .replace(/[:]/, ' ');

    return new Date(formattedString);
  }
}
