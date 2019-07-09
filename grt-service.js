const { spawn } = require('child_process');

const config = [
  { param: 'user', alias: 'u', type: 'string' },
  { param: 'org', alias: 'o', type: 'string' },
  { param: 'package', alias: 'p', type: 'string' },
  { param: 'deps', opposite: 'no-deps', type: 'bool' },
  { param: 'dev-deps', opposite: 'no-dev-deps', type: 'bool' },
  { param: 'peer-deps', opposite: 'no-peer-deps', type: 'bool' },
  { param: 'yarn-lock', opposite: 'no-yarn-lock', type: 'bool' },
  { param: 'package-lock', opposite: 'no-package-lock', type: 'bool' },
  { param: 'node', alias: 'n', type: 'bool' },
  { param: 'nvm', opposite: 'no-nvm', type: 'bool' },
  { param: 'engines', opposite: 'no-engines', type: 'bool' },
  { param: 'version', alias: 'v', type: 'bool' },
  { param: 'rate-limit', alias: 'l', type: 'bool' },
  { param: 'skip-empty', type: 'bool' },
  { param: 'skip-error', type: 'string' },
  { param: 'raw-json', type: 'bool' },
  { param: 'json', type: 'bool' },
  { param: 'token', alias: 't', type: 'string' },
  { param: 'help', alias: 'h', type: 'bool' },
]

class GrtService {

  execute(grtOptions) {
    return new Promise((resolve, reject) => {
      const ls = spawn('grt', grtOptions);
      let accumulatedData = '';
      let accumulatedErr = '';

      ls.stdout.on('data', (data) => {
        accumulatedData += data;
      });

      ls.stderr.on('data', (err) => {
        accumulatedErr += err;
      });

      ls.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(accumulatedErr || 'Unexpected error'));
        } else {
          resolve(accumulatedData);
        }
      });
    });
  }

  call(options) {
    try {
      const grtOptions = this.mapOptions(options);

      return this.execute(grtOptions);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  mapOptions(options) {
    const grtOptions = [];

    Object.getOwnPropertyNames(options).map(property => {
      const item = config.find(({ param, alias, opposite }) => {
        return (param === property || opposite === property || alias === property);
      });

      if (!item) {
        throw new Error(`Wrong options passed: ${property}`);
      }

      grtOptions.push(`--${item.param}`);

      if (item.type === 'string') {
        grtOptions.push(String(options[property]));
      }
    });

    return grtOptions;
  }

}

module.exports = GrtService;