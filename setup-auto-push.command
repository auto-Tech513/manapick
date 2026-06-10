#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
PLIST="$HOME/Library/LaunchAgents/com.manapick.autopush.plist"

mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
chmod +x "$DIR/scripts/auto-push.sh"
cp "$DIR/scripts/com.manapick.autopush.plist" "$PLIST"

cd "$DIR" && git config user.name "auto-Tech513" && git config user.email "auto-Tech513@users.noreply.github.com"

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"

echo "✅ 自動push常駐を設定しました。以後、Codexがコミットすると自動で公開されます。"
echo "ログ: ~/Library/Logs/manapick-autopush.log"
read -p "Enterで閉じる"
