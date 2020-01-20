const cron = require('node-cron');

async function everyMinute(doThis) {
  cron.schedule("0 * * * * *", () =>  {
    doThis();
  });
};

module.exports = { everyMinute };
