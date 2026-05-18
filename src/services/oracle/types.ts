export type Session = {
  question: string;
  started: boolean;
};

export type OracleResponse =
  | string
  | {
      type: 'oracle_result';
      currentQuestion: string;
      principal: any;
      complement: any;
      result: string;
    };

export type YinYang = {
  name: string;
  value: number;
  principal: string;
  complement: string;
};

export type Symbol = {
  id: number;
  name: string;
  firstLine: string;
  secondLine: string;
  thirtLine: string;
};

export type CodeHexagram = {
  code: number;
  inside: number;
  outside: number;
};

export type InfoHexagram = {
  code: number;
  title: string;
  imageTitle: string;
  image: string;
  inside: string;
  outside: string;
  description: string;
  bottomLine: string;
  twoLine: string;
  threeLine: string;
  fourLine: string;
  fiveLine: string;
  topLine: string;
};