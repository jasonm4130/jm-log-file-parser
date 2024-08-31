import { FileStream } from '.';
import fs from 'fs';

jest.mock('fs');

describe('FileStream', () => {
  const mockFile = '/path/to/mock/file.txt';
  let fileStream: FileStream;

  beforeEach(() => {
    fileStream = new FileStream(mockFile);
  });

  it('should initialize with the correct file path', () => {
    expect(fileStream.file).toBe(mockFile);
  });

  it('should call fs.createReadStream with the correct file path when read is called', () => {
    const mockCreateReadStream = fs.createReadStream as jest.Mock;
    fileStream.read();
    expect(mockCreateReadStream).toHaveBeenCalledWith(mockFile);
  });
});
