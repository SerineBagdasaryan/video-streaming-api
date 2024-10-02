// peer-server.ts
import * as fs from 'fs';
import { ExpressPeerServer } from 'peer';
import { INestApplication } from '@nestjs/common';

export function peerServer(app: INestApplication): void {
  const server = app.getHttpServer();
  const peerServer = ExpressPeerServer(server, { port: 3000 });
  app.use('/', peerServer);

  const recordingsDir = './recordings';
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir);
  }

  peerServer.on('connection', (client: any) => {
    console.log(`Client connected: ${client.id}`);
    const videoStream = fs.createWriteStream(
      `${recordingsDir}/${client.id}.webm`,
    );

    client.on('data', (data: any) => {
      videoStream.write(data);
      console.log(`Writing chunk of data from client ${client.id}`);
    });

    client.on('close', () => {
      console.log(`Client disconnected: ${client.id}`);
      videoStream.end(() => {
        console.log(`Finished writing data for client ${client.id}`);
      });
    });
  });

  peerServer.on('disconnect', (client: any) => {
    console.log(`Client disconnected: ${client.id}`);
  });
}
