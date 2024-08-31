import { PassThrough } from 'stream';
import { Parser } from '.';
import { FileStream } from '../FileStream';
import { calculateTopValues, getUniqueValues } from '../../helpers';
import { Options } from '../../types';
import { ChalkFunction } from 'chalk';

const mockOptions = {
  file: 'test.log',
  uniqueIpCount: true,
  topUrls: 3,
  activeIps: 3,
};

jest.mock('fs', () => ({
  createReadStream: jest.fn().mockReturnValue({
    on: jest.fn(),
  }),
}));

jest.mock('../FileStream', () => ({
  FileStream: jest.fn().mockImplementation(() => ({
    read: jest.fn().mockReturnValue(new PassThrough()),
  })),
}));

jest.mock('../../helpers', () => ({
  getUniqueValues: jest.fn().mockReturnValue(1),
  calculateTopValues: jest.fn().mockReturnValue(['url1', 'url2', 'url3']),
}));

describe('Parser', () => {
  let parser: Parser;
  let spyInit: jest.SpyInstance;
  let spySetupFileStream: jest.SpyInstance;
  let spyParseData: jest.SpyInstance;

  beforeEach(() => {
    parser = new Parser();
    spyInit = jest.spyOn(parser, 'init');
    spyInit.mockImplementation(function (this: Parser) {
      this.options = mockOptions;
    });
    spySetupFileStream = jest.spyOn(parser, 'setupFileStream');
    spyParseData = jest.spyOn(parser, 'parseData');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with values from options', () => {
    // Check the initial values
    expect(parser.program).toBeDefined();
    expect(parser.options).toEqual({});
    expect(parser.logs).toEqual([]);
    expect(parser.FileStream).toBeNull();
  });

  it('should call the init method on run', async () => {
    await parser.run();

    expect(spyInit).toHaveBeenCalled();
  });

  it('should setup the file stream on run', async () => {
    await parser.run();

    expect(spySetupFileStream).toHaveBeenCalled();
  });

  it('should return if no file stream is set up', async () => {
    spySetupFileStream.mockImplementation(() => {
      parser.FileStream = null;
    });
    await parser.run();

    expect(parser.data).toBeUndefined();
  });

  it('should call the parseData method on run', async () => {
    await parser.run();

    expect(spyParseData).toHaveBeenCalled();
  });

  it('should return if no data is set up', async () => {
    parser.data = undefined;
    await parser.run();

    expect(parser.logs).toEqual([]);
  });

  it('should log the unique IP count if the option is set', async () => {
    const spyGetUniqueIpCount = jest.spyOn(parser, 'getUniqueIpCount');

    parser.run();
    parser.data?.emit('end');

    await expect(spyGetUniqueIpCount).toHaveBeenCalled();
    await expect(getUniqueValues).toHaveBeenCalled();
    await expect(getUniqueValues).toHaveBeenCalledWith('ip');
  });

  it('should log the top URLs if the option is set', async () => {
    const spyGetTopUrls = jest.spyOn(parser, 'getTopUrls');
    const spliceSpy = jest.spyOn(Array.prototype, 'splice');

    parser.run();
    parser.data?.emit('end');

    await expect(spyGetTopUrls).toHaveBeenCalled();
    await expect(calculateTopValues).toHaveBeenCalled();
    await expect(calculateTopValues).toHaveBeenCalledWith('url');
    await expect(spliceSpy).toHaveBeenCalled();
    await expect(spliceSpy).toHaveBeenCalledWith(0, mockOptions.topUrls);
  });

  it('should log the active IPs if the option is set', async () => {
    const spyGetActiveIps = jest.spyOn(parser, 'getActiveIps');
    const spliceSpy = jest.spyOn(Array.prototype, 'splice');

    parser.run();
    parser.data?.emit('end');

    await expect(spyGetActiveIps).toHaveBeenCalled();
    await expect(calculateTopValues).toHaveBeenCalled();
    await expect(calculateTopValues).toHaveBeenCalledWith('ip');
    await expect(spliceSpy).toHaveBeenCalled();
    await expect(spliceSpy).toHaveBeenCalledWith(0, mockOptions.activeIps);
  });

  it('should call the get methods even when silent is set', async () => {
    parser.options.silent = true;
    const spyGetUniqueIpCount = jest.spyOn(parser, 'getUniqueIpCount');
    const spyGetTopUrls = jest.spyOn(parser, 'getTopUrls');
    const spyGetActiveIps = jest.spyOn(parser, 'getActiveIps');

    parser.run();
    parser.data?.emit('end');

    await expect(spyGetUniqueIpCount).toHaveBeenCalled();
    await expect(spyGetTopUrls).toHaveBeenCalled();
    await expect(spyGetActiveIps).toHaveBeenCalled();
  });

  it('should throw an error if no file is specified', () => {
    parser.options = {} as unknown as Options;

    expect(() => parser.setupFileStream()).toThrowError('No file specified');
  });

  it('should create a new FileStream instance', () => {
    parser.options = mockOptions;
    parser.setupFileStream();

    expect(FileStream).toHaveBeenCalled();
    expect(FileStream).toHaveBeenCalledWith(mockOptions.file);
  });

  it('should log with chalk if provided', async () => {
    jest.resetAllMocks();
    const spyConsoleLog = jest.spyOn(console, 'log');

    parser.displayOutput('test', jest.fn() as unknown as ChalkFunction);

    await expect(spyConsoleLog).toHaveBeenCalled();
  });

  it('should log without chalk if not provided', async () => {
    jest.resetAllMocks();
    const spyConsoleLog = jest.spyOn(console, 'log');

    parser.displayOutput('test');

    await expect(spyConsoleLog).toHaveBeenCalled();
  });

  it('should not log if silent option is set', async () => {
    jest.resetAllMocks();
    const spyConsoleLog = jest.spyOn(console, 'log');

    parser.options.silent = true;
    parser.displayOutput('test');

    await expect(spyConsoleLog).not.toHaveBeenCalled();
  });
});
