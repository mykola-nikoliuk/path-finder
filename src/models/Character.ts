import EventEmitter from 'eventemitter3';
import { Position } from '../types';

enum CharacterEvents {
  moved = 'moved',
}

export class Character extends EventEmitter {
  static readonly events = CharacterEvents;

  private _position: Position;

  constructor(position: Position) {
    super();
    this._position = { x: position.x, y: position.y };
  }

  goPath(path: Position[]) {
    // animate path
  }

  get position(): Position {
      return {
        x: this._position.x,
        y: this._position.y
      }
  }
}
