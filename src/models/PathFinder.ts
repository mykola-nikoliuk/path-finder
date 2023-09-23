import { GridMap } from './GridMap';
import { GridCell, Position } from '../types';
import { Vector } from './Vector';

const DIAGONAL_MULTIPLIER = 1.4142135624;

const AVAILABLE_DIRECTIONS: { shift: Vector; multiplier: number }[] = [
  { shift: new Vector({x: 0, y: 1 }), multiplier: 1 },
  { shift: new Vector({x: 1, y: 1 }), multiplier: DIAGONAL_MULTIPLIER },
  { shift: new Vector({x: 1, y: 0 }), multiplier: 1 },
  { shift: new Vector({x: 1, y: -1 }), multiplier: DIAGONAL_MULTIPLIER },
  { shift: new Vector({x: 0, y: -1 }), multiplier: 1 },
  { shift: new Vector({x: -1, y: -1 }), multiplier: DIAGONAL_MULTIPLIER },
  { shift: new Vector({x: -1, y: 0 }), multiplier: 1 },
  { shift: new Vector({x: -1, y: 1 }), multiplier: DIAGONAL_MULTIPLIER },
]

export class PathFinder {

  private path: Position[] = [];
  private from: Vector | null = null;
  private to: Vector | null = null;

  constructor(private readonly gridMap: GridMap<GridCell>) {
  }

  getPath(): Position[] {
    return JSON.parse(JSON.stringify(this.path));
  }

  setFrom(pos: Position) {
    this.from = new Vector(pos);
    this.findPath();
  }

  setTo(pos: Position) {
    this.to = new Vector(pos);
    this.findPath();
  }

  setNext(pos: Position) {
    this.from = this.to;
    this.to = new Vector(pos);
    this.findPath();
  }

  private findPath() {
    const { from, to } = this;
    if (from && to) {
      const pathMap = new GridMap<number>(this.gridMap.size, Infinity);
      let isEndFound = false;
      let cellsPool: Vector[] = [from.clone()];
      pathMap.set(from, 0);

      while (!isEndFound && cellsPool.length) {

        cellsPool = cellsPool.reduce((acc, cell, index) => {
          const previousCellValue = Math.max(pathMap.get(cell), 0);

          const cellsForNextStep = AVAILABLE_DIRECTIONS.reduce((acc, direction) => {
            const cellCost = direction.multiplier;
            const nextCell = direction.shift.clone().add(cell);

            if (this.gridMap.has(nextCell)) {
              const currentValue = previousCellValue + cellCost;
              const nextCellValue = pathMap.get(nextCell);
              const isCellWalkable = this.gridMap.get(nextCell) !== GridCell.Block;

              if (currentValue < nextCellValue && isCellWalkable) {
                pathMap.set(nextCell, currentValue);
                acc.push(nextCell);
                if (nextCell.isEqual(to)) {
                  isEndFound = true;
                }
              }
            }

            return acc;
          }, [] as Vector[]);

          acc.push(...cellsForNextStep);

          return acc;

        }, [] as Vector[]);
      }

      if (isEndFound) {
        let currentCell = to.clone();
        let isStartFound = false;
        const newPath: Vector[] = [currentCell];

        while (!isStartFound) {
          const direction = this.findCheapestWay(currentCell, pathMap);
          currentCell = currentCell.clone().add(direction);
          newPath.push(currentCell);
          if (currentCell.isEqual(from)) {
            isStartFound = true;
          }
        }

        this.path = newPath.reverse();
      }

      return isEndFound;
    }

    return null;
  }

  findCheapestWay(vector: Vector, pathMap: GridMap<number>) {
    const costs = AVAILABLE_DIRECTIONS.map((direction) => {
      const directionCell = vector.clone().add(direction.shift);
      return pathMap.has(directionCell) ? pathMap.get(directionCell) : Infinity;
    });

    const cheapestDirectionIndex = costs.reduce((acc, cost, index) => {
      return cost < costs[acc] ? index : acc;
    }, 0);

    return AVAILABLE_DIRECTIONS[cheapestDirectionIndex].shift.clone();
  }
}
