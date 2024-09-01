import { Parser } from '..';
import { init, processOption } from './init';
import path from 'path';

jest.mock('..', () => ({
  Parser: jest.fn().mockImplementation(() => {
    return {
      program: {
        version: jest.fn().mockReturnThis(),
        description: jest.fn().mockReturnThis(),
        requiredOption: jest.fn().mockReturnThis(),
        option: jest.fn().mockReturnThis(),
        parse: jest.fn().mockReturnThis(),
        opts: jest.fn().mockReturnValue({}),
      },
      options: {},
    } as unknown as Parser;
  }),
}));

jest.mock('path', () => ({
  resolve: jest.fn((filePath) => `/resolved/${filePath}`),
}));

describe('init', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
    parser.program = {
      version: jest.fn().mockReturnThis(),
      description: jest.fn().mockReturnThis(),
      requiredOption: jest.fn().mockReturnThis(),
      option: jest.fn().mockReturnThis(),
      parse: jest.fn().mockReturnThis(),
      opts: jest.fn().mockReturnValue({
        file: 'test.log',
        topUrls: '3',
        activeIps: '3',
      }),
    } as unknown as Parser['program'];
  });

  it('should initialize the program with correct options', () => {
    init.call(parser);

    expect(parser.program.version).toHaveBeenCalledWith('1.0.0');
    expect(parser.program.requiredOption).toHaveBeenCalledWith(
      '-f, --file <file>',
      'The file to parse',
    );
    expect(parser.program.option).toHaveBeenCalledWith(
      '-s, --silent',
      'Output nothing',
    );
    expect(parser.program.option).toHaveBeenCalledWith(
      '--unique-ip-count [boolean]',
      'Output the unique IP count',
      true,
    );
    expect(parser.program.option).toHaveBeenCalledWith(
      '--top-urls [number|boolean]',
      'Output URLs with the most hits, or false to disable',
      '3',
    );
    expect(parser.program.option).toHaveBeenCalledWith(
      '--active-ips [number|boolean]',
      'Output IPs with the most hits, or false to disable',
      '3',
    );
    expect(parser.program.parse).toHaveBeenCalledWith(process.argv);
  });

  it('should resolve the file path', () => {
    init.call(parser);

    expect(path.resolve).toHaveBeenCalledWith('test.log');
    expect(parser.options.file).toBe('/resolved/test.log');
  });

  it('should convert topUrls and activeIps to numbers', () => {
    init.call(parser);

    expect(parser.options.topUrls).toBe(3);
    expect(parser.options.activeIps).toBe(3);
  });

  it('should handle non-string topUrls and activeIps', () => {
    parser.program.opts = jest.fn().mockReturnValue({
      file: 'test.log',
      topUrls: 5,
      activeIps: 10,
    });

    init.call(parser);

    expect(parser.options.topUrls).toBe(5);
    expect(parser.options.activeIps).toBe(10);
  });
});

describe('processOption', () => {
  it('should process a boolean option', () => {
    expect(processOption(true)).toBe(3);
    expect(processOption(false)).toBe(false);
  });

  it('should process a string option', () => {
    expect(processOption('true')).toBe(3);
    expect(processOption('false')).toBe(false);
    expect(processOption('5')).toBe(5);
  });

  it('should return the default count if the option is invalid', () => {
    expect(processOption('invalid')).toBe(3);
  });
});
