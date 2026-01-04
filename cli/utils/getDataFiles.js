const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const getDataFiles = (wwwDir) => {
  const dataDir = path.join(wwwDir, 'data');
  if (!fs.existsSync(dataDir) || !fs.statSync(dataDir).isDirectory()) {
    console.warn(
      chalk.yellow(`Warning: data directory not found at ${dataDir}. Skipping translation copy.`),
    );
    return [];
  }
  return fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(dataDir, file));
};

module.exports = getDataFiles;
