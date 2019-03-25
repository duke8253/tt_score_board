'use strict'

// TODO: (node:13342) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners added. Use emitter.setMaxListeners() to increase limit

const express = require('express')
const http    = require('http');
const util    = require('util');
const fs      = require('fs');
const url     = require('url');
const path    = require('path');
const redis   = require('redis');
const bodyParser = require('body-parser')

const port = 8080;

const app = express();

const sub = redis.createClient();
const pub = redis.createClient();

class ServerEvent {
  constructor() {
    this.id = ''
    this.data = '';
  }

  addId(id) {
    this.id = 'id: ' + id + '\n';
  }

  addData(data) {
    var lines = data.split(/\n/);
    for (var i = 0; i < lines.length; ++i) {
      var element = lines[i];
      this.data += 'data: ' + element + '\n';
    }
  }

  payload() {
    var payload = '';
    payload += this.id;
    payload += this.data;
    return payload + '\n';
  }
};

sub.subscribe('match-update');

app.use('/match', express.static(path.join(__dirname, '/match')));
app.use('/umpire', express.static(path.join(__dirname, '/umpire')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.send('Table Tennis Utilities!');
  res.end();
});

app.get('/match', function(req, res) {
  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    initSSE(req, res);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(path.join(__dirname, '/match/match.html')));
    res.end();
  }
});

app.get('/umpire', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(fs.readFileSync(path.join(__dirname, 'umpire/umpire.html')));
  res.end();
});

app.post('/umpire', function(req, res) {
  console.log(req.body);
  pub.publish('match-update', 'test');
  res.end();
});

app.listen(port, function() {
  console.log('server listening on port: ' + port);
});

function initSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var id = (new Date()).toLocaleTimeString();

  sub.on('message', function(channel, message) {
    console.log('channel: ' + channel);
    console.log('message: ' + message);
    var messageEvent = new ServerEvent();
    messageEvent.addId(id);
    messageEvent.addData(message);
    sendSSE(res, messageEvent.payload());
  });
}

function sendSSE(res, payload) {
  res.write(payload);
}
