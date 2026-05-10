import * as StorageRules from "../lib/storage";
import { Bag } from "./Bag";

function storageCellClass(priority: boolean, active: boolean) {
  return ["storage-cell", priority ? "priority-cell" : "", active ? "drop-target" : ""]
    .filter(Boolean)
    .join(" ");
}

export function StorageArea({
  cells,
  dropTarget,
  unloadDisabled,
  onUnload
}: {
  cells: StorageRules.StorageCells;
  dropTarget: number | null;
  unloadDisabled: boolean;
  onUnload: () => void;
}) {
  return (
    <section aria-labelledby="storage-title" className="section storage-section">
      <div className="section-heading">
        <h2 id="storage-title">Storage Area</h2>
        <button
          className="unload-button"
          disabled={unloadDisabled}
          onClick={onUnload}
          type="button"
        >
          unload
        </button>
      </div>

      <div aria-label="Three by three luggage storage area" className="storage-grid" role="grid">
        {cells.map((bag, index) => {
          const priority = StorageRules.isPriorityIndex(index);

          return (
            <div
              aria-label={`Storage slot ${index + 1}${priority ? ", priority" : ""}`}
              className={storageCellClass(priority, dropTarget === index)}
              data-filled={bag ? "true" : "false"}
              data-index={index}
              data-storage-cell
              key={index}
              role="gridcell"
            >
              {bag ? (
                <>
                  <Bag id={bag.id} small />
                  <span className="placed-at">#{bag.placedAt}</span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
