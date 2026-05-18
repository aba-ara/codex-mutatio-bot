import { WASocket } from '@whiskeysockets/baileys';
import { sendImageFile, sendImageUrl, sendText } from './sender';

type OracleResult = {
  type: 'oracle_result';
  currentQuestion: string;
  principal: any;
  complement: any;
  result: string;
};

function formatHexagramText(hexagram: any, isComplement = false) {
  return `☯ HEXAGRAMA ${isComplement ? 'COMPLEMENTAR' : 'PRINCIPAL'}

Código: ${hexagram?.code}
Título: ${hexagram?.title}
Significado: ${hexagram?.imageTitle}
No interior: ${hexagram?.inside}
No exterior: ${hexagram?.outside}

Descrição:
${hexagram?.description}

Linha inferior:
${hexagram?.bottomLine}

Linha 2:
${hexagram?.twoLine}

Linha 3:
${hexagram?.threeLine}

Linha 4:
${hexagram?.fourLine}

Linha 5:
${hexagram?.fiveLine}

Linha superior:
${hexagram?.topLine}`;
}

function getClosingText() {
  return `🌌 Sua consulta foi encerrada.

O I Ching não entrega respostas absolutas, mas revela movimentos, tendências e possibilidades dentro do fluxo da vida.

Reflita com calma sobre os símbolos e mensagens recebidas.

Evite repetir a mesma consulta em sequência.
Permita que a situação evolua naturalmente antes de retornar ao oráculo.

✨ Considere um ciclo de 1 a 3 meses para uma nova consulta sobre o mesmo tema.

Se esta experiência trouxe clareza, inspiração ou reflexão para sua jornada e você desejar apoiar o projeto Codex Mutatio, você pode contribuir com qualquer valor através do LivePix:

✨ https://livepix.gg/SEUUSUARIO

O QR Code será enviado logo abaixo.

Namastê. ☯`;
}

export async function sendResult(
  sock: WASocket,
  jid: string,
  response: OracleResult
) {
  await sendText(
    sock,
    jid,
    `🪙 As moedas foram lançadas...

☯ LEITURA DAS MOEDAS

CARA = 2 = --
COROA = 3 = ---

☰ POLARIDADES

YIN = --
YANG = ---`
  );

  await sendText(sock, jid, `☯ Linhas geradas:
    
${response.result}

☰ TRIGRAMAS

☰ Céu = --- / --- / ---
☳ Trovão = -- / -- / ---
☵ Água = -- / --- / --
☶ Montanha = --- / -- / --
☷ Terra = -- / -- / --
☴ Vento = --- / --- / --
☲ Fogo = --- / -- / ---
☱ Lago = -- / --- / ---`);

  await sendImageUrl(
    sock,
    jid,
    response.principal.image,
    formatHexagramText(response.principal, false)
  );

  await sendImageUrl(
    sock,
    jid,
    response.complement.image,
    formatHexagramText(response.complement, true)
  );

  await sendText(sock, jid, getClosingText());

  await sendImageFile(
    sock,
    jid,
    './public/assets/images/livepix/qr-code.png',
    '✨ Apoie o projeto Codex Mutatio via LivePix'
  );
}