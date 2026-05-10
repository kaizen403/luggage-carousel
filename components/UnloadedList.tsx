import type { UnloadItem } from "../lib/storage";
import { packageLabel } from "../lib/labels";

export function UnloadedList({ bags }: { bags: UnloadItem[] }) {
  return (
    <section aria-labelledby="unloaded-title" className="unloaded">
      <h2 id="unloaded-title">Unloaded</h2>
      <ol aria-live="polite">
        {bags.length === 0 ? (
          <li>none</li>
        ) : (
          bags.map((bag, index) => (
            <li key={`${bag.id}-${index}`}>
              {packageLabel(bag.id)}
              {bag.priority ? " priority" : ""}
            </li>
          ))
        )}
      </ol>
    </section>
  );
}
