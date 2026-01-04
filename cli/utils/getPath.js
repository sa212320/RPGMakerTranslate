const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function getPaths(gameDir) {
  const targetDir = gameDir.replace(/^'|'$/g, '');
  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    console.error(chalk.redBright(`Invalid target directory: ${targetDir}`));
    process.exit(1);
  }
  let wwwDir = path.join(targetDir, 'www');
  if (!fs.existsSync(wwwDir) || !fs.statSync(wwwDir).isDirectory()) {
    wwwDir = targetDir;
    if (!fs.existsSync(wwwDir) || !fs.statSync(wwwDir).isDirectory()) {
      console.error(chalk.redBright(`Invalid target directory: ${targetDir}`));
      process.exit(1);
    }
  }
  const jsDir = path.join(wwwDir, 'js');
  if (!fs.existsSync(jsDir) || !fs.statSync(jsDir).isDirectory()) {
    console.warn(chalk.yellow(`${jsDir} not found; continuing but some steps may be skipped.`));
  }
  return {targetDir, wwwDir};
}

module.exports = getPaths;
