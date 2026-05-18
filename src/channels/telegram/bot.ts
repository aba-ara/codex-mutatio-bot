import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { handleMessage } from '../../services/oracle';
import { sendResult } from './send-result';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN não configurado no .env');
}

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  const response = handleMessage(String(ctx.from.id), '/start');

  if (typeof response === 'string') {
    await ctx.reply(response);
  }
});

bot.on('text', async (ctx) => {
  const userId = String(ctx.from.id);
  const text = ctx.message.text;

  const response = handleMessage(userId, text);

  if (typeof response === 'string') {
    await ctx.reply(response);
    return;
  }

  await sendResult(ctx, response);
});

export async function startTelegramBot() {
  await bot.launch();
  console.log('✅ Telegram conectado com sucesso.');
}

if (require.main === module) {
  startTelegramBot().catch((error) => {
    console.error('❌ Erro ao iniciar Telegram:', error);
  });
}