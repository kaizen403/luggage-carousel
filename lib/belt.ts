export type Bag = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  speed: number;
  grabbed?: boolean;
};

export type BeltState = {
  bags: Bag[];
  nextSeed: number;
};

export const BAG_SIZE = 44;
export const BAG_SPACING = 72;
export const BELT_SPEED = 82;

const BAG_Y = 56;
const OFFSCREEN_RIGHT = 90;

export function createBag(seed: number, x: number): Bag {
  return {
    id: `bag-${seed}`,
    label: `package ${seed + 1}`,
    x,
    y: BAG_Y,
    width: BAG_SIZE,
    speed: BELT_SPEED
  };
}

export function createInitialBelt(): BeltState {
  const bags: Bag[] = [];
  let nextSeed = 0;

  for (let index = -4; index < 14; index += 1) {
    bags.push(createBag(nextSeed, index * BAG_SPACING));
    nextSeed += 1;
  }

  return { bags, nextSeed };
}

export function moveBags(bags: Bag[], seconds: number): void {
  bags.forEach((bag) => {
    bag.x += bag.speed * seconds;
  });
}

export function fillBelt(bags: Bag[], nextSeed: number, viewportWidth: number): BeltState {
  const keptBags = bags.filter((bag) => bag.grabbed || bag.x < viewportWidth + OFFSCREEN_RIGHT);
  let leftmost = keptBags.reduce((min, bag) => Math.min(min, bag.x), viewportWidth);
  let seed = nextSeed;

  while (leftmost > -BAG_SPACING) {
    leftmost -= BAG_SPACING;
    keptBags.unshift(createBag(seed, leftmost));
    seed += 1;
  }

  return { bags: keptBags, nextSeed: seed };
}

export function getVisibleBags(bags: Bag[], viewportWidth: number): Bag[] {
  return bags.filter(
    (bag) => !bag.grabbed && bag.x + bag.width >= 0 && bag.x <= viewportWidth
  );
}
