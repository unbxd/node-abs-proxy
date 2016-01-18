var expect = require('Chai').expect;
var request = require('request');
var http = require('http');
var $ = require('cheerio');
var absProxy = require('../index');
var server;

describe('With http://httpbin.org', function() {
    describe('GET /', function() {
        before(function() {
            var proxy = absProxy
                .createAbsProxy({host: 'httpbin.org', port: 80});
            server = http.createServer(function(req, res) {
                proxy.dispatch(req, res);
            }).listen(8080, 'localhost');
        });

        after(function() {
            server.close();
        });

        it('should return 200', function(done) {
            this.timeout(5000);
            var options = {
                url: 'http://localhost:8080',
                headers: {
                    'Content-Type': 'text/plain'
                }
            };

            request.get(options, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it('should contain proper title', function(done) {
            this.timeout(5000);
            var options = {
                url: 'http://localhost:8080',
                headers: {
                    'Content-Type': 'text/plain'
                }
            };

            request.get(options, function(err, res, body) {
                expect($('title', body).text())
                    .to.equal("httpbin(1): HTTP Client Testing Service");
                done();
            });            
        })
    });
});