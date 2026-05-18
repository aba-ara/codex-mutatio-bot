import { startWhatsappBot } from './channels/whatsapp/bot';
// import { startTelegramBot } from './channels/telegram/bot';

async function main() {
  console.log('🌌 Iniciando Codex Mutatio Bot...');

  await startWhatsappBot();
  // Telegram opcional por enquanto
  // await startTelegramBot();

  console.log('✅ Bots iniciados.');
}

main().catch((error) => {
  console.error('❌ Erro ao iniciar os bots:', error);
});