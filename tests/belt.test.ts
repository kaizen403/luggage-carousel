import assert from "node:assert/strict";
import * as Belt from "../lib/belt.ts";

function assertNoOverlap(bags: Belt.Bag[]): void {
  const sorted = bags.slice().sort((a, b) => a.x - b.x);

  for (let index = 1; index < sorted.length; index += 1) {
    const gap = sorted[index].x - sorted[index - 1].x;
    assert.ok(gap >= Belt.BAG_SPACING, `expected gap >= ${Belt.BAG_SPACING}, got ${gap}`);
  }
}

{
  const belt = Belt.createInitialBelt();

  assert.equal(belt.bags.length, 18);
  assert.equal(belt.nextSeed, 18);
  assertNoOverlap(belt.bags);
}

{
  const belt = Belt.createInitialBelt();

  Belt.moveBags(belt.bags, 1);

  assertNoOverlap(belt.bags);
  assert.equal(belt.bags[0].speed, belt.bags[1].speed);
}

{
  const result = Belt.fillBelt([Belt.createBag(1, 600)], 2, 700);
  const leftmost = Math.min(...result.bags.map((bag) => bag.x));

  assert.ok(leftmost <= -Belt.BAG_SPACING);
  assertNoOverlap(result.bags);
}

{
  const bags = [
    Belt.createBag(1, -100),
    Belt.createBag(2, 0),
    Belt.createBag(3, 700),
    Belt.createBag(4, 800)
  ];
  bags[1].grabbed = true;

  assert.deepEqual(
    Belt.getVisibleBags(bags, 700).map((bag) => bag.id),
    ["bag-3"]
  );
}

console.log("belt rules verified");
