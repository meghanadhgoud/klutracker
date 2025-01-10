const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let clients = {};

server.on('connection', ws => {
    const userId = Math.floor(Math.random() * 1000);
    clients[userId] = ws;

    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.action === 'update') {
            broadcastLocationUpdate(userId, data.lat, data.lng);
        }
    });

    ws.on('close', () => {
        delete clients[userId];
        broadcastDisconnection(userId);
    });

    console.log(`User ${userId} connected`);
});

function broadcastLocationUpdate(userId, lat, lng) {
    const message = JSON.stringify({ action: 'update', userId: userId, lat: lat, lng: lng });
    Object.values(clients).forEach(client => {
        client.send(message);
    });
}

function broadcastDisconnection(userId) {
    const message = JSON.stringify({ action: 'disconnect', userId: userId });
    Object.values(clients).forEach(client => {
        client.send(message);
    });
}

console.log('WebSocket server started on port 8080');
