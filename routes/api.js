'use strict';

const Book = require("../Book");
module.exports = function (app) {

    app.route('/api/books')
        .get(async function (req, res) {
            try {
                let allBooks = await Book.find()
                res.json(allBooks)

            } catch (e) {
                res.status(500).json(e)
            }
        })

        .post(async function (req, res) {
            try {
                const {title} = req.body
                if (!title) return res.send("missing required field title")
                const book = await Book.create({title})
                res.json({ "_id": book._id, "title": title, "comments": book.comments })

            } catch (e) {
                res.status(500).json(e)
            }
        })

        .delete(async function (req, res) {
            try {
                await Book.deleteMany()
                res.send('complete delete successful')

            } catch (e) {
                res.status(500).json(e)
            }
        });


    app.route('/api/books/:id')
        .get(async function (req, res) {
            try {
                let bookId = req.params.id;
                const book = await Book.findById(bookId)
                if (!book) {
                    return res.send('no book exists');
                }

                res.json({_id: book._id, title: book.title, comments: book.comments});

            } catch (e) {
                res.status(500).json(e)
            }

        })

        .post(async function (req, res) {
            try {
                let bookId = req.params.id;
                let comment = req.body.comment;

                if (!comment) {
                    return res.send('missing required field comment');
                }

                const book = await Book.findById(bookId)
                if (!book) {
                    return res.send('no book exists');
                }

                book.comments.push(comment)
                book.commentcount = book.comments.length;
                await book.save();

                res.json({_id: book._id, title: book.title, comments: book.comments});

            } catch (e) {
                res.status(500).json(e)
            }

        })

        .delete(async function (req, res) {
            try {
                const bookId = req.params.id;
                const isBookExists = await Book.findById(bookId);

                if (!isBookExists) {
                    return res.send('no book exists');
                }

                await Book.findByIdAndDelete(bookId);
                res.send('delete successful');

            } catch (e) {
                res.status(500).json(e);
            }
        });

};
