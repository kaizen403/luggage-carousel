import type { Bag as BeltBag } from "../lib/belt";
import { Bag } from "./Bag";

export type DragGhostState = {
  bag: BeltBag;
  x: number;
  y: number;
};

export function DragGhost({ ghost }: { ghost: DragGhostState | null }) {
  return (
    <div
      aria-hidden="true"
      className={`drag-ghost${ghost ? " is-visible" : ""}`}
      style={ghost ? { transform: `translate3d(${ghost.x}px, ${ghost.y}px, 0)` } : undefined}
    >
      {ghost ? <Bag id={ghost.bag.id} /> : null}
    </div>
  );
}
