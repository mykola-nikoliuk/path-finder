export enum GridCell {
  Empty = 'empty',
  Block = 'block',
  Trail = 'trail',
  Start = 'start',
  End = 'end',
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}
