const express = require('express');
const app = express();
const ws = require('ws');
const http = require('http');
const crypto = require('crypto');

const server = http.createServer(app);
const wss = new ws.Server({ server });
app.use(express.static('public'));

app.set('view engine', 'ejs');
const mapClients = new Map()
Map.prototype.find = function(callback)  {
  for (const [clé, valeur] of this.entries()) {
    if (callback(valeur, clé) === true) {
      return { valeur, clé };
    }
  }
  return null;
}
wss.on('connection', (socket) => {
  const id = crypto.randomUUID();
  socket.on('message', (rawBuffer) => {
    const message = JSON.parse(rawBuffer.toString());
    switch (message.ACTION) {
      case 'REJOINDRE_SALON':
        message
    }
  })

});
