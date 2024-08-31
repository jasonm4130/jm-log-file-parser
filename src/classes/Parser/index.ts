import chalk, { ChalkInstance } from 'chalk';
import { init } from './methods/init';
import { Command } from 'commander';
import { Options } from '../../types';
import { FileStream } from '../FileStream';
import { parseData } from './methods/parseData';
import { Log, LogProperties } from '../Log';
import { ReadStream } from 'fs';
import { getUniqueValues, calculateTopValues } from '../../helpers';

export class Parser {
  program: Command;
  options: Options;
  init: () => void;
  FileStream: FileStream | null;
  data?: ReadStream;
  logs: Log[];
  parseData: () => void;
  getUniqueValues: (key: keyof LogProperties) => number;
  calculateTopValues: (key: keyof LogProperties) => string[];

  constructor() {
    this.program = new Command();
    this.options = {} as Options;
    this.logs = [];
    this.FileStream = null;
    this.init = init.bind(this);
    this.parseData = parseData.bind(this);
    this.getUniqueValues = getUniqueValues.bind(this);
    this.calculateTopValues = calculateTopValues.bind(this);
  }

  async run() {
    this.init();

    this.setupFileStream();

    this.data = this.FileStream?.read();

    this.parseData();

    this.data?.on('end', () => {
      if (this.options.uniqueIpCount) {
        const uniqueIpCount = this.getUniqueIpCount();
        this.displayOutput(`Unique IP count: ${uniqueIpCount}`, chalk.green);
      }

      if (
        typeof this.options.topUrls === 'number' &&
        this.options.topUrls > 0
      ) {
        const topUrls = this.getTopUrls();
        this.displayOutput('Top URLs:', chalk.blue);
        this.displayOutput(topUrls.join('\n'), chalk.blue);
      }

      if (
        typeof this.options.activeIps === 'number' &&
        this.options.activeIps > 0
      ) {
        const activeIps = this.getActiveIps();
        this.displayOutput('Active IPs:', chalk.yellow);
        this.displayOutput(activeIps.join('\n'), chalk.yellow);
      }
    });
  }

  displayOutput(string: string, chalkWrapper?: ChalkInstance) {
    if (this.options.silent) {
      return;
    }

    if (chalkWrapper) {
      console.log(chalkWrapper(string));
      return;
    }

    console.log(string);
  }

  getUniqueIpCount() {
    return this.getUniqueValues('ip');
  }

  getTopUrls() {
    return this.calculateTopValues('url').splice(
      0,
      this.options.topUrls as number,
    );
  }

  getActiveIps() {
    return this.calculateTopValues('ip').splice(
      0,
      this.options.activeIps as number,
    );
  }

  setupFileStream() {
    if (!this.options.file) {
      throw new Error('No file specified');
    }

    this.FileStream = new FileStream(this.options.file);
  }
}
