import { Position, Size } from '../types';

export class GridMap<Cell> {
    private grid: Cell[][] = [];
    private isReady = false;

    constructor(public readonly size: Size, fill?: Cell) {
      if (fill) {
        for (let y = 0; y <size.height; y++) {
          this.grid.push([]);
          for (let x = 0; x <size.width; x++) {
            this.grid[y].push(fill);
          }
        }
        this.isReady = true;
      }
    }

    get({x, y }: Position) {
      if (!this.isReady) throw Error('Grid is not created');
      if (x >= this.size.width || y >= this.size.height) {
        throw Error('Coordinates are out of grid');
      }

      return this.grid[y][x];
    }

    set({ x, y }: Position, value: Cell) {
      if (!this.isReady) throw Error('Grid is not created');
      if (x < 0 || y < 0 || x >= this.size.width || y >= this.size.height) {
        throw Error('Coordinates are out of grid');
      }

      return this.grid[y][x] = value;
    }

    has({x, y }: Position): boolean {
      return x >= 0 && x < this.size.width && y >= 0 && y < this.size.height;
    }

    setBatch(positions: Position[], value: Cell) {
      positions.forEach(position => {
        this.set(position, value);
      });
      return value;
    }

    replaceValue(from: Cell[], to: Cell) {
      for (let y = 0; y <this.size.height; y++) {
        this.grid.push([]);
        for (let x = 0; x <this.size.width; x++) {
          if (from.includes(this.grid[y][x])) {
            this.grid[y][x] = to;
          }
        }
      }
    }

    static stringify<Cell>({ size, grid, isReady }: GridMap<Cell>): string {
      if (!isReady) throw Error('Grid is not created');
      return JSON.stringify({
        size,
        grid,
      });
    }

    static parse<Cell>(data: string, constructor: Constructable) {
      const {size, grid}: {size: Size; grid: GridMap<Cell>['grid']} = JSON.parse(data);
      const instance = new constructor(size);
      instance.grid = grid;
      instance.isReady = true;
      return instance;
    }
}

interface Constructable {
  new (...args: any[]): any;
}
