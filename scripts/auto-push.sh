#!/bin/bash
# Manapick auto-push: push committed changes when main is ahead of origin/main.
REPO="/Users/mu/Documents/Codex/2026-05-24/files-mentioned-by-the-user-app/manapick-repo"
LOG="$HOME/Library/Logs/manapick-autopush.log"

cd "$REPO" || exit 0

AHEAD=$(git rev-list --count origin/main..main 2>/dev/null || echo 0)
if [ "${AHEAD:-0}" -gt 0 ]; then
  if git push origin main >/dev/null 2>&1; then
    echo "$(date '+%F %T') pushed ${AHEAD} commit(s)" >> "$LOG"
  else
    echo "$(date '+%F %T') push FAILED (${AHEAD} ahead)" >> "$LOG"
  fi
fi
