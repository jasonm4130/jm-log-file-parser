import { Parser } from '..';
import path from 'path';
import { Options } from '../../../types';

const DEFAULT_COUNT = 3;

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
    .option('--unique-ip-count [boolean]', 'Output the unique IP count', true)
    .option(
      '--top-urls [number|boolean]',
      'Output URLs with the most hits, or false to disable',
      '3',
    )
    .option(
      '--active-ips [number|boolean]',
      'Output IPs with the most hits, or false to disable',
      '3',
    )
    .parse(process.argv);

  // Get the raw options from the program
  const rawOptions = this.program.opts();

  // Assign the options to the instance
  this.options = rawOptions as Options;

  // Resolve the file path, we can assume it exists because it's a required option
  this.options.file = path.resolve(rawOptions.file);

  // Process the three options to expected types
  this.options.topUrls = processOption(rawOptions.topUrls);
  this.options.activeIps = processOption(rawOptions.activeIps);

  // Process the uniqueIpCount option to a boolean
  if (typeof rawOptions.uniqueIpCount !== 'boolean') {
    this.options.uniqueIpCount =
      rawOptions.uniqueIpCount?.toLowerCase() === 'true';
  }
}

export function processOption(option: string | boolean | number) {
  // If the option is a string, check if it's a boolean
  const boolStrings = ['true', 'false'];
  if (
    typeof option === 'string' &&
    boolStrings.includes(option.toLocaleLowerCase())
  ) {
    return option.toLocaleLowerCase() === 'true' ? DEFAULT_COUNT : false;
  }

  // If the option is a string, check if it's a number
  if (typeof option === 'string' && !isNaN(parseInt(option))) {
    return parseInt(option);
  }

  // If the option is a boolean, return it
  if (typeof option === 'boolean') {
    return option ? DEFAULT_COUNT : false;
  }

  // if the option is a number, return it
  if (typeof option === 'number') {
    return option;
  }

  // If all else fails, return the default value of 3
  return DEFAULT_COUNT;
}
