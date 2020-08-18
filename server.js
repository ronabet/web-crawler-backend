const express = require("express");
const app = express();
const http = require("http").Server(app);
const router = require("./router");
const cors = require('cors')
const bodyParser = require("body-parser");
const config = require('./config/config');

class Server {
  constructor() {
    this.app = express();
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.listen(config.config.port, function() {
        console.log("Server listening on port: " + config.config.port);
    });
    router(this.app);
  }
}

module.exports.Server = Server;
