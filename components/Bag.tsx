import { packageLabel } from "../lib/labels";

export function Bag({ id, small = false }: { id: string; small?: boolean }) {
  return <span className={`bag${small ? " bag-small" : ""}`}>{packageLabel(id)}</span>;
}
