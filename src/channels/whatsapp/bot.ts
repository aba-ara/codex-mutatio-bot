import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';

import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';

import { getMessageText } from './message-parser';
import { sendText } from './sender';
import { sendResult } from './send-result';
import { handleWhatsappMessage } from '../../services/oracle';

export async function startWhatsappBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    browser: ['Codex Mutatio', 'Chrome', '1.0.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('📲 Escaneie o QR Code abaixo:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso.');
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        await startWhatsappBot();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid;
    if (!jid) return;

    const text = getMessageText(msg);
    if (!text.trim()) return;

    const response = handleWhatsappMessage(jid, text);

    if (typeof response === 'string') {
      await sendText(sock, jid, response);
      return;
    }

    await sendResult(sock, jid, response);
  });
}

startWhatsappBot().catch((error) => {
  console.error('❌ Erro ao iniciar WhatsApp:', error);
});