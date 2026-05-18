import {
  yinYangs,
  symbols,
  codeHexagrams,
  infoHexagrams,
} from './data';

import {
  Session,
  OracleResponse,
  InfoHexagram,
} from './types';

const sessions: Record<string, Session> = {};

function createCoin() {
  const value = Math.random() < 0.5 ? 2 : 3;

  return {
    name: value === 2 ? 'Cara' : 'Coroa',
    value,
    symbol: value === 2 ? '--' : '---',
  };
}

function createLine() {
  const coins = [createCoin(), createCoin(), createCoin()];

  const sum = coins.reduce((acc, coin) => acc + coin.value, 0);

  return {
    coins,
    sum,
  };
}

function createHexagram() {
  return Array.from({ length: 6 }, () => createLine());
}

function lineDescription(value: number): string {
  switch (value) {
    case 6:
      return 'Yin mutável';
    case 7:
      return 'Yang fixo';
    case 8:
      return 'Yin fixo';
    case 9:
      return 'Yang mutável';
    default:
      return 'Linha inválida';
  }
}

function getLines(
  lines: number[],
  type: 'principal' | 'complement'
): string[] {
  return lines.map((line) => {
    const item = yinYangs.find((x) => x.value === line);

    if (!item) {
      throw new Error(`Linha inválida: ${line}`);
    }

    return type === 'principal' ? item.principal : item.complement;
  });
}

function getHexagramInfo(
  lines: any,
  type: 'principal' | 'complement'
): InfoHexagram {
  const convertedLines = getLines(lines, type);

  const insideLines = convertedLines.slice(0, 3);
  const outsideLines = convertedLines.slice(3, 6);

  const insideSymbol = symbols.find(
    (symbol) =>
      symbol.firstLine === insideLines[0] &&
      symbol.secondLine === insideLines[1] &&
      symbol.thirtLine === insideLines[2]
  );

  const outsideSymbol = symbols.find(
    (symbol) =>
      symbol.firstLine === outsideLines[0] &&
      symbol.secondLine === outsideLines[1] &&
      symbol.thirtLine === outsideLines[2]
  );

  if (!insideSymbol || !outsideSymbol) {
    throw new Error('Não foi possível identificar os trigramas.');
  }

  const codeHexagram = codeHexagrams.find(
    (hexagram) =>
      hexagram.inside === insideSymbol.id &&
      hexagram.outside === outsideSymbol.id
  );

  if (!codeHexagram) {
    throw new Error('Não foi possível identificar o código do hexagrama.');
  }

  const infoHexagram = infoHexagrams.find(
    (hexagram) => hexagram.code === codeHexagram.code
  );

  if (!infoHexagram) {
    throw new Error(`Informações do hexagrama ${codeHexagram.code} não encontradas.`);
  }

  return infoHexagram;
}

function buildLinesResult(lines: ReturnType<typeof createLine>[]): string {
  return lines
    .map((line, index) => {
      const coins = line.coins
        .map((coin) => {
          return `${coin.name.toLowerCase()} (${coin.symbol})`;
        })
        .join(' + ');

      const finalSymbol =
        line.sum === 6 || line.sum === 8
          ? '(--)'
          : '(---)';

      return `${index + 1}ª linha:
${coins} = ${line.sum} ${finalSymbol}
${lineDescription(line.sum)}`;
    })
    .join('\n\n');
}

function getIntroMessage(): string {
  return `🌌 Bem-vindo ao Codex Mutatio.

Este oráculo é inspirado no I Ching — o Livro das Mutações — uma antiga obra da sabedoria chinesa utilizada há milhares de anos como instrumento de reflexão, orientação e compreensão dos ciclos da vida.

Aqui, cada lançamento de moeda representa o movimento entre Yin e Yang, formando hexagramas que revelam padrões, direções e mensagens simbólicas sobre sua jornada.

Antes de iniciar:

• Faça uma pergunta sincera
• Evite perguntas de “sim” ou “não”
• Concentre sua mente na situação que deseja compreender

Exemplos:

✨ "O que preciso compreender sobre este momento?"
✨ "Qual energia está influenciando meu caminho?"
✨ "O que devo desenvolver dentro de mim agora?"

Quando estiver pronto, envie sua pergunta ao oráculo. 🔮`;
}

function getQuestionReceivedMessage(question: string): string {
  return `🔮 Pergunta recebida:

"${question}"

Respire fundo, concentre-se na sua pergunta
e quando estiver pronto, digite:

JOGAR MOEDAS`;
}

export function handleMessage(
  phone: string,
  message: string
): OracleResponse {
  const text = message.trim().toLowerCase();

  if (!sessions[phone]) {
    sessions[phone] = {
      question: '',
      started: false,
    };

    return getIntroMessage();
  }

  const session = sessions[phone];

  if (!session.started) {
    session.started = true;
    session.question = message;

    return getQuestionReceivedMessage(message);
  }

  if (text !== 'jogar moedas') {
    return `Para continuar sua consulta, digite:

JOGAR MOEDAS`;
  }

  const lines = createHexagram();

  const sums = lines.map((line) => line.sum);

  const principal = getHexagramInfo(sums, 'principal');
  const complement = getHexagramInfo(sums, 'complement');

  const result = buildLinesResult(lines);
  const currentQuestion = session.question;

  delete sessions[phone];

  return {
    type: 'oracle_result',
    currentQuestion,
    principal,
    complement,
    result,
  };
}