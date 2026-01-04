const clamp = (start, value, end) => {
  return Math.min(Math.max(value, start), end);
};

const range = (end) => {
  return Array.from({length: end}, (_, i) => i);
};

const runManyPromises = async (promises, {limit = 100, delay = 10} = {}) => {
  if (promises?.length > 0) {
    const LIMIT = clamp(1, limit, 100);
    let index = 0;
    const run = async () => {
      const tempIndex = index;
      index++;
      if (promises[tempIndex]) {
        await promises[tempIndex]();
        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
        await run();
      }
    };
    return Promise.all(range(LIMIT).map(() => run()));
  }
};

module.exports = runManyPromises;
