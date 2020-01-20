module.exports = (function () {
  return async function (body) {
    const { error } = require('../models');
    await error.create(body);
  };
})();
