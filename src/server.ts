import { WebSocket } from "ws";
import net from "net";

// Directly start a WebSocket server on port 4000
const wss = new WebSocket.Server({ port: 4000 });

const host = '192.168.0.215';
const port = 65432;

wss.on("connection", (ws) => {
  console.log("Connected to websocket through client");

  const tcpClient = net.createConnection({ host, port }, () => {
    console.log(`Connected to ${host}:${port}`)
  });

  tcpClient.on('data', (dataFromC: any) => {
    console.log('Data from Raw Socket Server:', dataFromC.toString());
    ws.send(dataFromC.toString());  // Or handle data format if needed
  });
  
  tcpClient.on('connectionAttempt', () => {
    console.log(`Attempted to connect to ${host}`);
  });
  tcpClient.on('connectionAttemptFailed', () => {
    console.log(`Connection attempt to ${host} failed`);
  });
  tcpClient.on('connectionAttemptTimeout', () => {
    console.log(`Connection attempt to ${host} timed out`);
  });

  ws.on("message", (message) => {
    console.log(`Sent ${message} to ${host}:${port}`)
    
    tcpClient.write(message.toString());
  });

  tcpClient.on('end', () => {
    console.log(`TCP connection to ${host} closed`);
    ws.close();
  });

});

console.log("WebSocket-only server listening on port 4000");
