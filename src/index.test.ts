import { Parser } from './classes';

jest.mock('./classes');

const spyParserRun = jest
  .spyOn(Parser.prototype, 'run')
  .mockImplementation(() => Promise.resolve());

describe('Parser', () => {
  it('should create a new instance of Parser', async () => {
    await import('./index');
    expect(Parser).toHaveBeenCalled();
  });

  it('should call parser.run', async () => {
    await import('./index');
    expect(spyParserRun).toHaveBeenCalled();
  });
});
