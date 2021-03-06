'use strict';

const moment = require('moment');

module.exports = function(Book) {

	Book.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      ctx.instance.createdon = moment().unix();
      ctx.instance.modifiedon = moment().unix();
      next();
    } else {
      ctx.data.modifiedon = moment().unix();
      next();
    }
  });
};
