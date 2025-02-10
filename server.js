const express = require('express');
const next = require('next');
const https = require('https');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const HOST = '192.168.119.17'; 
  const PORT = 3000;

  https.createServer(options, server).listen(PORT, HOST, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://192.168.119.17:${PORT}`);  
  });
});
