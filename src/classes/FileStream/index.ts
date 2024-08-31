import fs from 'fs';

export class FileStream {
  file: string;

  constructor(file: string) {
    this.file = file;
  }

  read() {
    return fs.createReadStream(this.file);
  }
}
