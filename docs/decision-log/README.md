# Pending decision-log entries

Each file here is one decision waiting to be folded into [`../DECISION-LOG.md`](../DECISION-LOG.md): named `YYYY-MM-DD-short-name.md`, holding exactly one row, `| Date | Kind | Decision | Ref |`. See "How to keep this file" in DECISION-LOG.md.

From `prototype/`: `npm run decision-log` validates and prints the pending entries; `npm run decision-log -- --fold` appends them to the log and deletes these files (on main, in a commit of its own).
