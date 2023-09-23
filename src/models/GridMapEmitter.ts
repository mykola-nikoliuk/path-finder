import EventEmitter from 'eventemitter3';
import { GridMap } from './GridMap';
import { Position } from '../types';

enum GridMapEvents {
  update = 'update',
}

export class GridMapEmitter<Cell> extends GridMap<Cell> {
    public readonly emitter = new EventEmitter();
    static events = GridMapEvents;

    constructor(...args: ConstructorParameters<typeof GridMap<Cell>>) {
      super(...args);
    }

    set(...args: Parameters<GridMap<Cell>['set']>) {
      const value = super.set(...args);
      this.emitter.emit(GridMapEmitter.events.update, this);
      return value;
    }

    replaceValue(...args: Parameters<GridMap<Cell>['replaceValue']>) {
      super.replaceValue(...args);
      this.emitter.emit(GridMapEmitter.events.update, this);
    }

    setBatch(...args: Parameters<GridMap<Cell>['setBatch']>) {
      const value = super.setBatch(...args);
      this.emitter.emit(GridMapEmitter.events.update, this);
      return value;
    }
}

