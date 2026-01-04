import chalk from 'chalk';
import path from 'path';

export function logDivider() {
  console.log();
  console.log(chalk.grey('============================================='));
  console.log();
}

export function logLogo() {
  console.log('██████╗ ██████╗  ██████╗ ');
  console.log('██╔══██╗██╔══██╗██╔════╝ ');
  console.log('██████╔╝██████╔╝██║  ███╗');
  console.log('██╔══██╗██╔═══╝ ██║   ██║');
  console.log('██║  ██║██║     ╚██████╔╝');
  console.log('╚═╝  ╚═╝╚═╝      ╚═════╝ ');
  console.log('       RPG Tools.       ');
}

export function getRootPath() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  return path.resolve(__dirname, '../../');
}

export default {
  logDivider,
  logLogo,
  getRootPath,
};
