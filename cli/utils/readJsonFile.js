const fs = require('fs');
const chalk = require('chalk');

const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.redBright(`Error reading JSON file at ${filePath}: ${error.message}`));
    return null;
  }
};
module.exports = readJsonFile;
