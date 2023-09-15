/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);


suite('Functional Tests', function () {

    /*
    * ----[EXAMPLE TEST]----
    * Each test should completely test the response of the API end-point including response status code!
    */
    test('#example Test GET /api/books', function (done) {
        chai.request(server)
            .get('/api/books')
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.isArray(res.body, 'response should be an array')
                assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
                assert.property(res.body[0], 'title', 'Books in array should contain title')
                assert.property(res.body[0], '_id', 'Books in array should contain _id')
                done()
            })
    })
    /*
    * ----[END of EXAMPLE TEST]----
    */

    suite('Routing tests', function () {


        suite('POST /api/books with title => create book object/expect book object', function () {

            test('Test POST /api/books with title', function (done) {
                chai.request(server)
                    .post('/api/books')
                    .send({title: 'Title'})
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.property(res.body, '_id')
                        assert.property(res.body, 'title')
                        assert.property(res.body, 'comments')
                        assert.equal(res.body.title, 'Title')
                        assert.isArray(res.body.comments, 'comments should be an array')
                        assert.equal(res.body.comments.length, 0)
                        _idTest = res.body._id

                        done()
                    })
            });

            test('Test POST /api/books with no title given', function (done) {
                chai.request(server)
                    .post('/api/books')
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.text, 'missing required field title')
                        done()
                    })
            });

        });


        suite('GET /api/books => array of books', function () {

            test('Test GET /api/books', function (done) {
                chai.request(server)
                    .get('/api/books')
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.isArray(res.body, 'response should be an array')
                        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
                        assert.property(res.body[0], 'title', 'Books in array should contain title')
                        assert.property(res.body[0], '_id', 'Books in array should contain _id')

                        done()
                    });
            });

        });


        suite('GET /api/books/[id] => book object with [id]', function () {

            test('Test GET /api/books/[id] with id not in db', function (done) {
                chai.request(server)
                    .get('/api/books/' + '5bfefdaba9b6224af04fa1be')
                    .end(function (err, res) {
                        assert.equal(res.text, 'no book exists')
                        done()
                    })
            });

            test('Test GET /api/books/[id] with id not in db', function (done) {
                chai.request(server)
                    .get('/api/books/' + '5bfefdaba9b6224af04fa1be')
                    .end(function (err, res) {
                        assert.equal(res.text, 'no book exists')
                        done()
                    })
            });

            test('Test GET /api/books/[id] with valid id in db', function (done) {
                chai.request(server)
                    .get('/api/books/' + _idTest)
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.property(res.body, '_id')
                        assert.property(res.body, 'title')
                        assert.property(res.body, 'comments')
                        assert.equal(res.body.title, 'Title')
                        assert.isArray(res.body.comments, 'comments should be an array')
                        commentLength = res.body.comments.length

                        done()
                    })
            })

        })


        suite('POST /api/books/[id] => add comment/expect book object with id', function () {

            test('Test POST /api/books/[id] with comment', function (done) {
                chai.request(server)
                    .post('/api/books/' + _idTest)
                    .send({comment: 'Comment'})
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.property(res.body, '_id')
                        assert.property(res.body, 'title')
                        assert.property(res.body, 'comments')
                        assert.equal(res.body.title, 'Title')
                        assert.isArray(res.body.comments, 'comments should be an array')
                        let n = res.body.comments.length
                        assert.equal(res.body.comments[n - 1], 'Comment')
                        assert.equal(res.body.comments.length, commentLength + 1)

                        done()
                    })
            })

        })

        suite('DELETE /api/books with id', function () {

            test('Test DELETE /api/books with id not in db', function (done) {
                chai.request(server)
                    .delete('/api/books/' + '5bfefdaba9b6224af04fa1be')
                    .end(function (err, res) {
                        assert.equal(res.text, 'no book exists')

                        done()
                    })
            });

            test('Test DELETE /api/books with id in db', function (done) {
                chai.request(server)
                    .delete('/api/books/' + _idTest)
                    .end(function (err, res) {
                        assert.equal(res.status, 200)
                        assert.equal(res.text, 'delete successful')

                        done()
                    })
            })

        })

    })

})
