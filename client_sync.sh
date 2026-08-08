#!/bin/bash

# Exit on error
set -e

SOURCE_CHAT_DIR="./client/src/view/features/chat"
DEST_CHAT_DIR="./frontend/src/view/features/chat"

# Ensure source directory exists
if [ ! -d "$SOURCE_CHAT_DIR" ]; then
  echo "Error: Source directory $SOURCE_CHAT_DIR does not exist."
  exit 1
fi

# Create target parent directory if missing
mkdir -p ./frontend/src/view/features

# Remove existing target chat directory and copy fresh from client
rm -rf "$DEST_CHAT_DIR"
cp -r "$SOURCE_CHAT_DIR" "$DEST_CHAT_DIR"

echo "✅ Successfully synced chat folder from client to frontend!"
