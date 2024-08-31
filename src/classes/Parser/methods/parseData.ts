import { Log } from '../../Log';
import { Parser } from '..';

export function parseData(this: Parser) {
  if (!this.data) {
    return;
  }

  this.data.on('data', (chunk) => {
    for (let i = 0; i < chunk.length; i++) {
      // 10 is the ASCII code for a newline character
      if (chunk[i] === 10) {
        const log = new Log(chunk.slice(0, i).toString());
        this.logs.push(log);

        // Remove the log from the chunk
        chunk = chunk.slice(i + 1);

        // Reset the index
        i = 0;
      }
    }
  });
}
