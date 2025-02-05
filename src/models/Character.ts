import EventEmitter from 'eventemitter3';
import { Position } from '../types';

enum CharacterEvents {
  moved = 'moved',
}

const frameTime = 50;

export class Character extends EventEmitter {
  static readonly events = CharacterEvents;

  private _position: Position;
  private _pathIndex: number = 0;
  private _path: Position[] = [];
  private _animationInterval: ReturnType<typeof setInterval> | undefined;

  constructor(position: Position) {
    super();
    this._position = { x: position.x, y: position.y };
  }

  goPath(path: Position[]) {
    clearInterval(this._animationInterval);

    this._pathIndex = 0;
    this._path = path;

    this._animationInterval = setInterval(this.nextFrame.bind(this), frameTime);
    this.nextFrame();

  }

  get position(): Position {
      return {
        x: this._position.x,
        y: this._position.y
      }
  }


  private nextFrame() {
    if (this._pathIndex >= this._path.length) {
      clearInterval(this._animationInterval);
      return;
    }

    this._position = this._path[this._pathIndex];
    this.emit(CharacterEvents.moved, this.position);
    this._pathIndex++;
  }
}
