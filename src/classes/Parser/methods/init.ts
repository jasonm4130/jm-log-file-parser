import { Parser } from '..';
import path from 'path';
import { Options } from '../../../types';

/**
 * Initialize the CLI program
 * @param this - The Parser instance
 */
export function init(this: Parser) {
  this.program
    .version('1.0.0')
    .requiredOption('-f, --file <file>', 'The file to parse')
    .option('-d, --debug', 'Output extra debugging')
    .option('-s, --silent', 'Output nothing')
    .option('--unique-ip-count', 'Output the unique IP count', true)
    .option(
      '--top-urls <number|boolean>',
      'Output URLs with the most hits, or false to disable',
      '3',
    )
    .option(
      '--active-ips <number|boolean>',
      'Output IPs with the most hits, or false to disable',
      '3',
    )
    .parse(process.argv);

  // Get the raw options from the program
  const rawOptions = this.program.opts();

  // Assign the options to the instance
  this.options = rawOptions as Options;

  // Resolve the file path, we can assume it exists because it's a required option
  this.options.file = path.resolve(this.options.file);

  // If the top-urls option is a string, convert it to a number
  if (typeof rawOptions.topUrls === 'string') {
    this.options.topUrls = parseInt(rawOptions.topUrls);
  }

  // If the active-ips option is a string, convert it to a number
  if (typeof rawOptions.activeIps === 'string') {
    this.options.activeIps = parseInt(rawOptions.activeIps);
  }
}
