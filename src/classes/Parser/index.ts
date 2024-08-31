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

    if (this.options.silent) {
      return;
    }

    this.data?.on('end', () => {
      if (this.options.uniqueIpCount) {
        console.log(this.getUniqueIpCount());
      }

      if (
        typeof this.options.topUrls === 'number' &&
        this.options.topUrls > 0
      ) {
        console.log(this.getTopUrls());
      }

      if (
        typeof this.options.activeIps === 'number' &&
        this.options.activeIps > 0
      ) {
        console.log(this.getActiveIps());
      }
    });
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
