const express = require('express');
const app = express();
const {WebSocketServer} = require('ws');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs/promises');
const {setTimeout} = require('timers/promises');

let etatEcriture = Promise.resolve();
let queueSize = 0;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
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
async function writeFile(chemin, contenu, option = 'utf8'){
  while (queueSize >= 500){
    await setTimeout(50);
  }
  queueSize++;
  const attente = etatEcriture.catch(()=>{});
	etatEcriture = (async function(){
		await attente; 
		return await fs.writeFile(chemin, contenu, option);
	})();
	try{
		return await etatEcriture;
	}
	finally{
		queueSize--;
	}
}
wss.on('connection', (socket) => {
  socket.id = crypto.randomUUID();
	clientsMap.set(socket.id, socket);
});
server.listen(3000, ()=>{})
