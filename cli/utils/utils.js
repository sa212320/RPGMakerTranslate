const chalk = require('chalk');
const path = require('path');

function logDivider() {
  console.log();
  console.log(chalk.grey('============================================='));
  console.log();
}

function logLogo() {
  console.log('██████╗ ██████╗  ██████╗ ');
  console.log('██╔══██╗██╔══██╗██╔════╝ ');
  console.log('██████╔╝██████╔╝██║  ███╗');
  console.log('██╔══██╗██╔═══╝ ██║   ██║');
  console.log('██║  ██║██║     ╚██████╔╝');
  console.log('╚═╝  ╚═╝╚═╝      ╚═════╝ ');
  console.log('       RPG Tools.       ');
}

function getRootPath() {
  return path.resolve(__dirname, '../../');
}

module.exports = {
  logDivider,
  logLogo,
  getRootPath,
};
