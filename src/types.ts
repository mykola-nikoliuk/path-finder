export enum GridCell {
  Empty = 'empty',
  Block = 'block',
  Trail = 'trail',
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}
