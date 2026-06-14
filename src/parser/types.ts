export type TextSegment = { type: "text"; content: string };

export type TokenSegment = {
  type: "token";
  surface: string;
  yomi: string;
  emphasis: "normal" | "bold";
  hasOkurigana: boolean;
  writeWidth: number;
  readWidth: number;
  lineStyle: "solid" | "wavy";
};

export type Segment = TextSegment | TokenSegment;

export type ParseError = { line: number; message: string };

export type ParseResult = { segments: Segment[]; errors: ParseError[] };

export type PreviewMode = "write" | "read" | "answer-write" | "answer-read";
