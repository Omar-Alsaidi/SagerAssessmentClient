import { BATCH_MS } from "./config";

let queue = [];
let flushTimer = null;

export function resetBatch() {
  queue = [];
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
}

export function enqueueForFlush(get, features) {
  if (!features?.length) return;
  queue.push(...features);
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      const toFlush = queue;
      queue = [];
      flushTimer = null;
      get().ingestBatch(toFlush);
    }, BATCH_MS);
  }
}
