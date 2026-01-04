import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import getPaths from '../utils/getPath.js';
import {getRootPath} from '../utils/utils.js';

const copyFiles = (sdkDir, targetDir) => {
  if (!fs.existsSync(sdkDir) || !fs.statSync(sdkDir).isDirectory()) {
    console.error(chalk.redBright(`Invalid SDK directory: ${sdkDir}`));
    process.exit(1);
  }
  const files = fs.readdirSync(sdkDir);
  files.forEach((file) => {
    const srcPath = path.join(sdkDir, file);
    const destPath = path.join(targetDir, file);
    fs.copyFileSync(srcPath, destPath);
  });
};

export default async function installPluginTask({gameDir, language}) {
  const rootDir = getRootPath();
  const sdkDir = path.join(rootDir, './nw-sdk/');
  const {targetDir} = getPaths(gameDir);
  copyFiles(sdkDir, targetDir);
  console.log(chalk.greenBright(`Writing game JSON to ${outputPath}...`));
}
