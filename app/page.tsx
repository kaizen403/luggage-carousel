"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Carousel } from "../components/Carousel";
import { DragGhost, type DragGhostState } from "../components/DragGhost";
import { StorageArea } from "../components/StorageArea";
import { UnloadedList } from "../components/UnloadedList";
import * as Belt from "../lib/belt";
import * as StorageRules from "../lib/storage";

type DragState = {
  bag: Belt.Bag;
  source: HTMLButtonElement;
  pointerId: number;
  dropIndex: number | null;
};

const DRAG_OFFSET = 22;

export default function Home() {
  const initialBelt = useMemo(Belt.createInitialBelt, []);
  const beltRef = useRef<HTMLDivElement | null>(null);
  const bagsRef = useRef<Belt.Bag[]>(initialBelt.bags);
  const nextSeedRef = useRef(initialBelt.nextSeed);
  const lastFrameRef = useRef(0);
  const dragRef = useRef<DragState | null>(null);
  const placedAtRef = useRef(0);

  const [visibleBags, setVisibleBags] = useState<Belt.Bag[]>([]);
  const [storage, setStorage] = useState<StorageRules.StorageCells>(() =>
    StorageRules.createStorage()
  );
  const storageRef = useRef(storage);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [dragGhost, setDragGhost] = useState<DragGhostState | null>(null);
  const [unloaded, setUnloaded] = useState<StorageRules.UnloadItem[]>([]);

  useEffect(() => {
    storageRef.current = storage;
  }, [storage]);

  useEffect(() => {
    let frameId = 0;

    function tick(now: number) {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = now;
      }

      const elapsed = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      const width = beltRef.current?.clientWidth || 700;
      lastFrameRef.current = now;

      Belt.moveBags(bagsRef.current, elapsed);

      const belt = Belt.fillBelt(bagsRef.current, nextSeedRef.current, width);
      bagsRef.current = belt.bags;
      nextSeedRef.current = belt.nextSeed;

      setVisibleBags(Belt.getVisibleBags(bagsRef.current, width));
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const clearDrag = useCallback(() => {
    const drag = dragRef.current;

    if (drag?.source) {
      try {
        drag.source.releasePointerCapture(drag.pointerId);
      } catch {
        // Pointer capture may already be gone.
      }
    }

    dragRef.current = null;
    setDropTarget(null);
    setDragGhost(null);
  }, []);

  const moveGhost = useCallback((clientX: number, clientY: number, bag: Belt.Bag) => {
    setDragGhost({
      bag,
      x: clientX - DRAG_OFFSET,
      y: clientY - DRAG_OFFSET
    });
  }, []);

  const updateDropTarget = useCallback((clientX: number, clientY: number) => {
    const element = document.elementFromPoint(clientX, clientY);
    const cell = element?.closest<HTMLElement>("[data-storage-cell]");
    const index = cell && cell.dataset.filled !== "true" ? Number(cell.dataset.index) : null;

    if (dragRef.current) {
      dragRef.current.dropIndex = index;
    }

    setDropTarget(index);
  }, []);

  const moveDrag = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      moveGhost(event.clientX, event.clientY, drag.bag);
      updateDropTarget(event.clientX, event.clientY);
    },
    [moveGhost, updateDropTarget]
  );

  const cancelDrag = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      drag.bag.grabbed = false;
      clearDrag();
    },
    [clearDrag]
  );

  const endDrag = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      const dropIndex = drag.dropIndex;
      clearDrag();

      if (dropIndex === null || storageRef.current[dropIndex]) {
        drag.bag.grabbed = false;
        return;
      }

      const placedAt = placedAtRef.current + 1;
      placedAtRef.current = placedAt;

      setStorage((current) => {
        const next = current.slice();
        next[dropIndex] = {
          id: drag.bag.id,
          label: drag.bag.label,
          placedAt
        };
        return next;
      });

      bagsRef.current = bagsRef.current.filter((bag) => bag.id !== drag.bag.id);
      setUnloaded([]);
    },
    [clearDrag]
  );

  useEffect(() => {
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", cancelDrag);

    return () => {
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", cancelDrag);
    };
  }, [cancelDrag, endDrag, moveDrag]);

  const startDrag = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, bagId: string) => {
      const bag = bagsRef.current.find((item) => item.id === bagId);
      if (!bag) {
        return;
      }

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      bag.grabbed = true;

      dragRef.current = {
        bag,
        source: event.currentTarget,
        pointerId: event.pointerId,
        dropIndex: null
      };

      moveGhost(event.clientX, event.clientY, bag);
    },
    [moveGhost]
  );

  const unload = useCallback(() => {
    if (StorageRules.occupiedCount(storageRef.current) === 0) {
      return;
    }

    const result = StorageRules.unloadStorage(storageRef.current);
    setStorage(result.cells);
    setUnloaded(result.order);
  }, []);

  return (
    <main className="page">
      <h1>Luggage Carousel</h1>
      <Carousel beltRef={beltRef} bags={visibleBags} onStartDrag={startDrag} />
      <StorageArea
        cells={storage}
        dropTarget={dropTarget}
        unloadDisabled={StorageRules.occupiedCount(storage) === 0}
        onUnload={unload}
      />
      <UnloadedList bags={unloaded} />
      <DragGhost ghost={dragGhost} />
    </main>
  );
}
