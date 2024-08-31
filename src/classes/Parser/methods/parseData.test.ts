import { Parser } from '..';
import { Log } from '../../Log';
import { parseData } from './parseData';
import { EventEmitter } from 'events';

jest.mock('../../Log', () => {
  return {
    Log: jest.fn().mockImplementation((log: string) => {
      return { log } as unknown as Log;
    }),
  };
});

describe('parseData', () => {
  let parser: Parser;
  let dataEmitter: EventEmitter;

  beforeEach(() => {
    dataEmitter = new EventEmitter();
    parser = {
      data: dataEmitter,
      logs: [],
    } as unknown as Parser;

    parseData.call(parser);
    jest.clearAllMocks();
  });

  it('should parse logs from data chunks', () => {
    const chunk1 = Buffer.from('log1\nlog2\n');
    const chunk2 = Buffer.from('log3\nlog4\n');

    dataEmitter.emit('data', chunk1);
    dataEmitter.emit('data', chunk2);
    dataEmitter.emit('end');

    expect(parser.logs).toHaveLength(4);
    expect(Log).toHaveBeenCalledTimes(4);
    expect(Log).toHaveBeenNthCalledWith(1, 'log1');
    expect(Log).toHaveBeenNthCalledWith(2, 'log2');
    expect(Log).toHaveBeenNthCalledWith(3, 'log3');
    expect(Log).toHaveBeenNthCalledWith(4, 'log4');
  });

  it('should handle empty data', () => {
    dataEmitter.emit('data', Buffer.from(''));
    dataEmitter.emit('end');

    expect(parser.logs).toHaveLength(0);
  });

  it('should handle data without newline', () => {
    dataEmitter.emit('data', Buffer.from('log1'));
    dataEmitter.emit('end');

    expect(parser.logs).toHaveLength(0);
  });

  it('should handle data with partial logs', () => {
    dataEmitter.emit('data', Buffer.from('log1\nlog2'));
    dataEmitter.emit('end');

    expect(parser.logs).toHaveLength(1);
    expect(Log).toHaveBeenCalledTimes(1);
    expect(Log).toHaveBeenCalledWith('log1');
  });

  it('should handle no ReadStream', () => {
    parser.data = undefined;
    parseData.call(parser);

    expect(parser.logs).toHaveLength(0);
  });
});
