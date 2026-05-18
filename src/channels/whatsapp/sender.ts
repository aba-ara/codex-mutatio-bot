import { WASocket } from '@whiskeysockets/baileys';
import fs from 'fs';

export async function sendText(sock: WASocket, jid: string, text: string) {
  await sock.sendMessage(jid, { text });
}

export async function sendImageUrl(
  sock: WASocket,
  jid: string,
  url: string,
  caption: string
) {
  await sock.sendMessage(jid, {
    image: { url },
    caption,
  });
}

export async function sendImageFile(
  sock: WASocket,
  jid: string,
  path: string,
  caption: string
) {
  if (!fs.existsSync(path)) return;

  await sock.sendMessage(jid, {
    image: fs.readFileSync(path),
    caption,
  });
}