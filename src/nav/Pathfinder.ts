/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point {
  x: number;
  y: number;
}

export class Pathfinder {
  private gridSize: number;
  private width: number;
  private height: number;
  private grid: boolean[][]; // true = walkable

  constructor(width: number, height: number, gridSize: number) {
    this.width = width;
    this.height = height;
    this.gridSize = gridSize;
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);
    this.grid = Array(rows).fill(null).map(() => Array(cols).fill(true));
  }

  public setWalkable(x: number, y: number, walkable: boolean) {
    const col = Math.floor(x / this.gridSize);
    const row = Math.floor(y / this.gridSize);
    if (row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length) {
      this.grid[row][col] = walkable;
    }
  }

  public findPath(start: Point, end: Point): Point[] {
    const startCol = Math.floor(start.x / this.gridSize);
    const startRow = Math.floor(start.y / this.gridSize);
    const endCol = Math.floor(end.x / this.gridSize);
    const endRow = Math.floor(end.y / this.gridSize);

    if (startCol === endCol && startRow === endRow) return [end];

    const openSet: Node[] = [];
    const closedSet: Set<string> = new Set();

    const startNode = new Node(startCol, startRow, 0, this.heuristic(startCol, startRow, endCol, endRow));
    openSet.push(startNode);

    while (openSet.length > 0) {
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[currentIndex].f) {
          currentIndex = i;
        }
      }

      const current = openSet.splice(currentIndex, 1)[0];
      closedSet.add(`${current.col},${current.row}`);

      if (current.col === endCol && current.row === endRow) {
        const path: Point[] = [];
        let temp: Node | null = current;
        while (temp) {
          path.push({ x: temp.col * this.gridSize + this.gridSize / 2, y: temp.row * this.gridSize + this.gridSize / 2 });
          temp = temp.parent;
        }
        return path.reverse();
      }

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedSet.has(`${neighbor.col},${neighbor.row}`)) continue;

        const gScore = current.g + 1;
        let bestG = false;

        const existing = openSet.find(n => n.col === neighbor.col && n.row === neighbor.row);
        if (!existing) {
          neighbor.g = gScore;
          neighbor.h = this.heuristic(neighbor.col, neighbor.row, endCol, endRow);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
          openSet.push(neighbor);
          bestG = true;
        } else if (gScore < existing.g) {
          existing.g = gScore;
          existing.f = existing.g + existing.h;
          existing.parent = current;
          bestG = true;
        }
      }
    }

    return [end]; // Fallback
  }

  private heuristic(c1: number, r1: number, c2: number, r2: number): number {
    return Math.abs(c1 - c2) + Math.abs(r1 - r2);
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dc, dr] of dirs) {
      const nc = node.col + dc;
      const nr = node.row + dr;
      if (nr >= 0 && nr < this.grid.length && nc >= 0 && nc < this.grid[0].length && this.grid[nr][nc]) {
        neighbors.push(new Node(nc, nr));
      }
    }
    return neighbors;
  }
}

class Node {
  public f: number = 0;
  public g: number = 0;
  public h: number = 0;
  public parent: Node | null = null;

  constructor(public col: number, public row: number, g: number = 0, h: number = 0) {
    this.g = g;
    this.h = h;
    this.f = g + h;
  }
}
