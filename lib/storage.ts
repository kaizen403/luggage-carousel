export type StoredBag = {
  id: string;
  label: string;
  placedAt: number;
};

export type StorageCells = Array<StoredBag | null>;

export type UnloadItem = StoredBag & {
  slotIndex: number;
  priority: boolean;
};

export const GRID_SIZE = 9;
export const COLUMNS = 3;
export const PRIORITY_ROW = 0;

export function isPriorityIndex(index: number): boolean {
  return Math.floor(index / COLUMNS) === PRIORITY_ROW;
}

export function createStorage(): StorageCells {
  return Array.from({ length: GRID_SIZE }, () => null);
}

export function findUnloadOrder(cells: StorageCells): UnloadItem[] {
  const priority: UnloadItem[] = [];
  const normal: UnloadItem[] = [];

  cells.forEach((cell, index) => {
    if (!cell) {
      return;
    }

    const item: UnloadItem = {
      id: cell.id,
      label: cell.label,
      placedAt: cell.placedAt,
      slotIndex: index,
      priority: isPriorityIndex(index)
    };

    if (item.priority) {
      priority.push(item);
    } else {
      normal.push(item);
    }
  });

  function newestFirst(a: StoredBag, b: StoredBag): number {
    return b.placedAt - a.placedAt;
  }

  return priority.sort(newestFirst).concat(normal.sort(newestFirst));
}

export function unloadStorage(cells: StorageCells): {
  cells: StorageCells;
  order: UnloadItem[];
} {
  const order = findUnloadOrder(cells);
  const emptied = cells.slice();

  order.forEach((item) => {
    emptied[item.slotIndex] = null;
  });

  return {
    cells: emptied,
    order
  };
}

export function occupiedCount(cells: StorageCells): number {
  return cells.reduce((total, cell) => total + (cell ? 1 : 0), 0);
}
