#!/bin/bash
set -e

echo "Installing git hooks"

HOOKS_DIR="./.githooks"
GIT_HOOKS_DIR=".git/hooks"

for hook in "$HOOKS_DIR"/*; do
    hook=$(basename "$hook")
    if [ -f "$HOOKS_DIR/$hook" ]; then
        cp "$HOOKS_DIR/$hook" "$GIT_HOOKS_DIR/$hook"
        chmod +x "$GIT_HOOKS_DIR/$hook"
        echo "Installed $hook hook"
    else
        echo "$hook not found in $HOOKS_DIR"
    fi
done

echo "Git hooks installed"