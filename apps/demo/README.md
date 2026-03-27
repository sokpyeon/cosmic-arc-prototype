# COSMIC‑ARC Demo

This tiny demo shows the **golden path**:

1. A mock runtime adapter emits a few synthetic events.
2. `IngestionPipeline` normalises them into `EventEnvelope`s.
3. `TimelineEngine` reconstructs a parallel‑state timeline.
4. The two‑stage anomaly pipeline scores each event.
5. `EvidencePack` is generated containing a manifest, findings, and a timeline snapshot.

Run with:

```bash
cd apps/demo
npm install   # installs ts-node and workspace deps
npm run start
```

You should see a JSON dump of the evidence pack printed to the console.
