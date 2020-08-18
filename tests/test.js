const { Server } = require("../server");
const request = require("supertest");

describe("router", function() {
    let server;
    before(function() {
      server = new Server();
    });
    
    context('#POST /api/crawling', function () {
        it('Should return crawling data', function (done) {
            const crawlingRequestBody = {
            "startUrl": "www.google.co.il",
            "maxDepth": "1", 
            "maxPages": "5"
            };
            this.timeout(10000);
            request(server.app)
                .post('/api/crawling')
                .send(crawlingRequestBody)
                .expect(200)
                .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
                });
            });
        });

        context('#POST /api/crawling', function () {
            it('Should return URL error', function (done) {
                const crawlingRequestBody = {
                "startUrl": "www.google.co.ill",
                "maxDepth": "1", 
                "maxPages": "5"
                };
                this.timeout(10000);
                request(server.app)
                    .post('/api/crawling')
                    .send(crawlingRequestBody)
                    .expect({Error: "URL is not valid!"})
                    .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                    });
                });
            });
})