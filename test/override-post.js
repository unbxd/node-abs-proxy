var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var absProxy = require('../index');
var server;
var proxy;

describe('With http://httpbin.org, override', function() {
    describe('POST /post', function() {
        var TEST_MESSAGE = 'test message';
        var options = {
            url: 'http://localhost:8080/post',
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        before(function() {
            proxy = absProxy
                .createAbsProxy({host: 'httpbin.org', port: 80});
            proxy.onPost('/post', function(req, res) {
                res.writeHead(201, {'Content-Type': 'text/plain'});
                res.end(TEST_MESSAGE);
            });

            server = http.createServer(function(req, res) {
                proxy.dispatch(req, res);
            }).listen(8080, 'localhost');
        });

        after(function() {
            server.close();
            proxy.listeners.post = [];
        });

        it('should return 201', function(done) {
            this.timeout(5000);

            request.post(options, function(err, res) {
                expect(res.statusCode).to.equal(201);
                done();
            });
        });

        it('should contain the body from override', function(done) {
            this.timeout(5000);

            request.post(options, function(err, res, body) {
                expect(body).to.equal(TEST_MESSAGE);
                done();
            });
        });
    });
});
