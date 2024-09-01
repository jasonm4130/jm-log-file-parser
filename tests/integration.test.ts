import { exec } from 'child_process';

describe('Integration', () => {
  it('should error if no file is provided', (done) => {
    exec('node ./bin/index.js', (error, stdout, stderr) => {
      expect(stderr).toContain(
        "error: required option '-f, --file <file>' not specified",
      );
      done();
    });
  });

  it('should run the program', (done) => {
    exec('node ./bin/index.js --file tests/test.log', (error, stdout) => {
      expect(stdout).toContain('Unique IP count: 11');
      expect(stdout).toContain('Top URLs:');
      expect(stdout).toContain('Active IPs:');
      done();
    });
  });

  it('should return the correct top URLs', (done) => {
    exec('node ./bin/index.js --file tests/test.log', (error, stdout) => {
      expect(stdout).toContain('/docs/manage-websites/');
      expect(stdout).toContain('/intranet-analytics/');
      expect(stdout).toContain('http://example.net/faq/');
      done();
    });
  });

  it('should return the correct active IPs', (done) => {
    exec('node ./bin/index.js --file tests/test.log', (error, stdout) => {
      expect(stdout).toContain('168.41.191.40');
      expect(stdout).toContain('177.71.128.21');
      expect(stdout).toContain('50.112.00.11');
      done();
    });
  });

  it('should return the correct number of unique IPs', (done) => {
    exec('node ./bin/index.js --file tests/test.log', (error, stdout) => {
      expect(stdout).toContain('Unique IP count: 11');
      done();
    });
  });

  it('should not output anything if silent is enabled', (done) => {
    exec(
      'node ./bin/index.js --file tests/test.log --silent',
      (error, stdout) => {
        expect(stdout).toBe('');
        done();
      },
    );
  });

  it('should return the correct number of top URLs when a different number is specified', (done) => {
    exec(
      'node ./bin/index.js --file tests/test.log --top-urls 2',
      (error, stdout) => {
        expect(stdout).toContain('/docs/manage-websites/');
        expect(stdout).toContain('/intranet-analytics/');
        done();
      },
    );
  });

  it('should return the correct number of active IPs when a different number is specified', (done) => {
    exec(
      'node ./bin/index.js --file tests/test.log --active-ips 2',
      (error, stdout) => {
        expect(stdout).toContain('168.41.191.40');
        expect(stdout).toContain('177.71.128.21');
        done();
      },
    );
  });

  it('should not return the number of top URLs when disabled', (done) => {
    exec(
      'node ./bin/index.js --file tests/test.log --top-urls false',
      (error, stdout) => {
        expect(stdout).not.toContain('Top URLs:');
        done();
      },
    );
  });

  it('should not return the number of active IPs when disabled', (done) => {
    exec(
      'node ./bin/index.js --file tests/test.log --active-ips false',
      (error, stdout) => {
        expect(stdout).not.toContain('Active IPs:');
        done();
      },
    );
  });

  it('should not return the number of unique IPs when disabled', (done) => {
    exec(
      'node ./bin/index.js --file tests/test.log --unique-ip-count false',
      (error, stdout) => {
        expect(stdout).not.toContain('Unique IP count:');
        done();
      },
    );
  });
});
