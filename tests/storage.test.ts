import assert from "node:assert/strict";
import * as StorageRules from "../lib/storage.ts";

function item(id: string, placedAt: number): StorageRules.StoredBag {
  return {
    id,
    label: id,
    placedAt
  };
}

{
  const cells = StorageRules.createStorage();
  cells[0] = item("priority-old", 3);
  cells[1] = item("priority-new", 5);
  cells[3] = item("normal-mid", 2);
  cells[6] = item("normal-old", 1);
  cells[8] = item("normal-new", 4);

  const result = StorageRules.unloadStorage(cells);

  assert.deepEqual(
    result.order.map((entry) => entry.id),
    ["priority-new", "priority-old", "normal-new", "normal-mid", "normal-old"]
  );
  assert.equal(StorageRules.occupiedCount(result.cells), 0);
  assert.equal(result.order[0].priority, true);
  assert.equal(result.order[2].priority, false);
}

{
  const cells = StorageRules.createStorage();
  cells[0] = item("first-priority", 1);
  cells[1] = item("last-priority", 9);
  cells[2] = item("middle-priority", 3);

  assert.deepEqual(
    StorageRules.findUnloadOrder(cells).map((entry) => entry.id),
    ["last-priority", "middle-priority", "first-priority"]
  );
}

console.log("storage rules verified");
