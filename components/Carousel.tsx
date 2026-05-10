import type { PointerEvent, RefObject } from "react";
import type { Bag as BeltBag } from "../lib/belt";
import { Bag } from "./Bag";

export function Carousel({
  beltRef,
  bags,
  onStartDrag
}: {
  beltRef: RefObject<HTMLDivElement | null>;
  bags: BeltBag[];
  onStartDrag: (event: PointerEvent<HTMLButtonElement>, bagId: string) => void;
}) {
  return (
    <section aria-labelledby="belt-title" className="section">
      <div className="section-heading">
        <h2 id="belt-title">Carousel</h2>
        <span aria-live="polite">{bags.length} visible</span>
      </div>

      <div aria-label="Infinite luggage carousel" className="belt" ref={beltRef}>
        <div className="belt-line" aria-hidden="true" />
        {bags.map((bag) => (
          <button
            aria-label={`Drag ${bag.label} into storage`}
            className="bag-button"
            key={bag.id}
            onPointerDown={(event) => onStartDrag(event, bag.id)}
            style={{ transform: `translate3d(${bag.x}px, ${bag.y}px, 0)` }}
            type="button"
          >
            <Bag id={bag.id} />
          </button>
        ))}
      </div>
    </section>
  );
}
