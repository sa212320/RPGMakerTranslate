import cliProgress from 'cli-progress';

const createBar = (format) => {
  format = format || `{bar} | {percentage}% | {duration_formatted} |{value}/{total}`;
  const option = cliProgress.Presets.shades_classic;
  cliProgress.SingleBar.prototype.log = function (...message) {
    this.stop();
    console.log(...message);
    this.start(this.total, this.value);
  };
  return new cliProgress.SingleBar({format}, option);
};

export default createBar;
