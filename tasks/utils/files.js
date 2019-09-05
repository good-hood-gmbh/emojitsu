const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const got = require('got');

const { logError } = require('./log');
const { parseUnicodeSpec } = require('./unicode');

const DEFAULT_EMOJI_VERSION = '11.0';
const buildPath = path.resolve(`${__dirname}/../../build`);

mkdirp.sync(buildPath);

const parseAndSave = (file, data) => {
  const parsedData = parseUnicodeSpec(data);
  fs.writeFileSync(file, JSON.stringify(parsedData, null, 2));
  return parsedData;
};

const utils = {
  getUnicodeSpec: async(string) => {
    const version = /\d+\.\d+/.test(string) ? string : DEFAULT_EMOJI_VERSION;

    const parsedFile = `${buildPath}/unicode-${version}.json`;
    const rawFile = `${buildPath}/unicode-${version}.txt`;
    const url = `http://unicode.org/Public/emoji/${version}/emoji-test.txt`;

    if (fs.existsSync(parsedFile)) return fs.readFileSync(parsedFile);
    if (fs.existsSync(parsedFile)) return parseAndSave(fs.readFileSync(rawFile));

    try {
      const { body } = await got(url);
      fs.writeFileSync(rawFile, body);
      return parseAndSave(body);
    } catch (error) {
      logError(`Wasn't able to fetch unicode data for url: ${url}, error: ${error}`);
    }
  },
};

module.exports = utils;
