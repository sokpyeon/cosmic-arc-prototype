import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';

/** Simple in‑memory timeline that orders events by logicalClock */
export class TimelineEngine {
  private events: EventEnvelope[] = [];

  /** Insert a new envelope – maintains sorted order */
  add(event: EventEnvelope): void {
    const idx = this.events.findIndex(e => e.logicalClock > event.logicalClock);
    if (idx === -1) {
      this.events.push(event);
    } else {
      this.events.splice(idx, 0, event);
    }
  }

  /** Retrieve the full ordered timeline */
  getTimeline(): readonly EventEnvelope[] {
    return this.events;
  }
}
