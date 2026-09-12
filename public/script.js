const ws = new WebSocket('ws://localhost:3000');
function rejoindreSalon() {
  ws.send(JSON.stringify({ idSalon: parseInt(document.getElementById("salonId").value), pseudo: document.getElementById("pseudoJoin").value, ACTION: "REJOINDRE_SALON" }));

}
ws.addEventListener('message', (rawBuffer) => { });
