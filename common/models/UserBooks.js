'use strict';

module.exports = function(UserBooks) {

	var app = require('../../server/server');

	UserBooks.observe('after save', function(ctx, next) {

	var book = app.models.book;

    if (ctx.isNewInstance) {
        book.findById(ctx.instance.bookId, function(err, bookModel) {
            if (err) next(err);
            if (!bookModel) {
               var err = new Error('Book not found');
               err.statusCode = 404;
               next(err);
            } else {
            	bookModel.available = bookModel.available - 1;
            	book.upsert(bookModel, function(err, model) {
            		if(err) next(err);
            		if(!model) {
            			var err = new Error('Book model failed to update');
                        err.statusCode = 404;
                        next(err);
            		} else {
            			next();
            		}
            	})
            }
        })
    } else {
      next();
    }
  });

	UserBooks.observe('loaded', function(ctx, next) {
		var book = app.models.book;

		if(ctx.data && ctx.data.bookId) {
			book.findById(ctx.data.bookId, function(err, bookModel) {
				if (err) next(err);
                if (!bookModel) {
                  var err = new Error('Book not found');
                  err.statusCode = 404;
                  next(err);
                } else {
                	ctx.data.isbn = bookModel.isbn;
                	ctx.data.title = bookModel.title;
                	ctx.data.author = bookModel.author;
                	delete ctx.data.userId;
                	next();
                }
			})
		}
	});

};
