const express = require('express');
const app = express();
const http = require('http');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');
const fs = require('fs/promises');
const { EventEmitter, once } = require('events');

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const eventBus = new EventEmitter();

app.use(express.static('public'));
app.set('view engine', 'ejs');

const mapClients = new Map();

let etatEcriture = Promise.resolve();
let queueSize = 0;

async function writeFile(chemin, contenu, option = 'utf8') {
  while (queueSize >= 500) {
    await once(eventBus, 'placeLiberee');
  }

  queueSize++;

  const attente = etatEcriture.catch(() => {});
  etatEcriture = (async function () {
    await attente;
    return await fs.writeFile(chemin, contenu, option);
  })();

  try {
    return await etatEcriture;
  } finally {
    queueSize--;
    eventBus.emit('placeLiberee');
  }
}

wss.on('connection', (socket) => {
  socket.id = crypto.randomUUID();
  mapClients.set(socket.id, socket);

  socket.on('close', () => {
    mapClients.delete(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
