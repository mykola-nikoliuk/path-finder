import { GridMap } from './GridMap';
import { GridCell, Position } from '../types';
import { Vector } from './Vector';

const DIAGONAL_MULTIPLIER = 1.4142135624;

const DIRECTIONS: { shift: Vector; multiplier: number }[] = [
  { shift: new Vector({x: 0, y: 1 }), multiplier: 1 },
  { shift: new Vector({x: 1, y: 0 }), multiplier: 1 },
  { shift: new Vector({x: 0, y: -1 }), multiplier: 1 },
  { shift: new Vector({x: -1, y: 0 }), multiplier: 1 },
  { shift: new Vector({x: 1, y: 1 }), multiplier: DIAGONAL_MULTIPLIER },
  { shift: new Vector({x: 1, y: -1 }), multiplier: DIAGONAL_MULTIPLIER },
  { shift: new Vector({x: -1, y: -1 }), multiplier: DIAGONAL_MULTIPLIER },
  { shift: new Vector({x: -1, y: 1 }), multiplier: DIAGONAL_MULTIPLIER },
];

const REVERSED_DIRECTIONS = DIRECTIONS.map((direction) => {
  const shift = direction.shift.clone();
  shift.x *= -1;
  shift.y *= -1;
  return {
    shift,
    multiplier: direction.multiplier
  }
});

export class PathFinder {

  private path: Position[] = [];
  private from: Vector | null = null;
  private to: Vector | null = null;

  constructor(private readonly gridMap: GridMap<GridCell>) {
  }

  getPath(): Position[] {
    return JSON.parse(JSON.stringify(this.path));
  }

  setPoints(from: Position, to: Position) {
    this.from = new Vector(from);
    this.to = new Vector(to);
    this.findPath();
    return this;
  }

  findClosestAvailablePosition(position: Position): Position | null {
    if (this.gridMap.get(position) !== GridCell.Block) return position;
    const maxRadius = Math.max(this.gridMap.size.width, this.gridMap.size.height);
    let result: Vector | null = null;

    for (let radius = 1; radius <= maxRadius && !result; radius++) {
      DIRECTIONS.forEach(direction => {
        if (result) return;

        const cell = new Vector(position);
        cell.add(direction.shift.clone().scalarMultiply(radius));

        if (cell.x < 0 || cell.x >= this.gridMap.size.width || cell.y < 0 || cell.y >= this.gridMap.size.height) {
          return;
        }

        if (this.gridMap.get(cell) !== GridCell.Block) {
          result = cell;
        }
      });
    }

    return result;
  }

  private findPath() {
    const { from, to } = this;
    if (from && to) {
      const pathMap = new GridMap<number>(this.gridMap.size, Infinity);
      let isEndFound = false;
      let cellsPool: Vector[] = [from.clone()];
      pathMap.set(from, 0);

      while (cellsPool.length) {

        cellsPool = cellsPool.reduce((acc, cell, index) => {
          const previousCellValue = Math.max(pathMap.get(cell), 0);

          const cellsForNextStep = DIRECTIONS.reduce((acc, direction) => {
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

  private findCheapestWay(vector: Vector, pathMap: GridMap<number>) {
    const costs = REVERSED_DIRECTIONS.map((direction) => {
      const directionCell = vector.clone().add(direction.shift);
      return pathMap.has(directionCell) ? pathMap.get(directionCell) + direction.multiplier : Infinity;
    });

    const cheapestDirectionIndex = costs.reduce((acc, cost, index) => {
      return cost < costs[acc] ? index : acc;
    }, 0);

    return REVERSED_DIRECTIONS[cheapestDirectionIndex].shift.clone();
  }
}
