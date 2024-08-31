# Log File Parser

This is a simple log file parser that reads a Nginx access log file and returns some statistics about it.
The log file parser has been built using Typescript and is designed to run on the Node.js runtime.
It has been built to handle large log files and is able to parse them in a streaming fashion.

## Installation

To start using the log file parser, you need to have Node.js installed on your machine. You can download it from the official website: [https://nodejs.org/en/download/](), or you can use one of the many alternative installation methods available. We recommend using the latest LTS version of Node.js, and installing it via [Volta](https://volta.sh/).

Once you have Node.js installed, you can install the log file parser by running the following command:

```bash
npm install -g jm-log-parser
# or
npx jm-log-parser
```

This will install the log file parser globally on your machine, so you can run it from anywhere.

## Usage

To use the log file parser, you need to provide it with the path to the log file you want to parse. You can do this by running the following command:

```bash
jm-log-parser -f /path/to/log/file
# or
jm-log-parser --file /path/to/log/file
```

This will start the log file parser and it will start reading the log file and parsing it. Once it has finished parsing the log file, it will output some statistics about the log file.

## Options

The log file parser supports the following options:

- `-f, --file <path>`: The path to the log file you want to parse.
- `-h, --help`: Display the help message.
- `-v, --version`: Display the version number.
- `-s, --silent`: Disable output. Useful for benchmarking.
- `--unique-ip-count`: Display the number of unique IP addresses in the log file. (default: true)
- `--active-ips <number|boolean>`: Display the most active IP addresses in the log file. (default: 3)
- `--top-urls <number|boolean>`: Display the most requested URLs in the log file. (default: 3)

You can use these options to customize the output of the log file parser.

## Examples

Here are some examples of how you can use the log file parser:

```bash
# Parse a log file and display the default statistics
jm-log-parser -f /path/to/log/file

# Parse a log file and display the number of unique IP addresses
jm-log-parser -f /path/to/log/file --unique-ip-count

# Parse a log file and display the top 5 most active IP addresses
jm-log-parser -f /path/to/log/file --active-ips 5

# Parse a log file and display the top 10 most requested URLs
jm-log-parser -f /path/to/log/file --top-urls 10
```

You can combine these options to get the desired output.

## Development

To develop the log file parser, you need to have Node.js installed on your machine. You can install the development dependencies by running the following command:

```bash
npm install
```

You can then run the log file parser in development mode by running the following command:

```bash
npm run start -- -f /path/to/log/file
```

This will start the log file parser it will start reading the log file and parsing it.

You can run the compiler in watch mode by running the following command:

```bash
npm run compile:watch
```

This will watch for changes in the source files and recompile them automatically.

You can run the tests by running the following command:

```bash
npm test
```

This will run the test suite and output the results.

Or run the tests in watch mode by running the following command:

```bash
npm run test:watch
```

This will watch for changes in the source files and re-run the tests automatically.
