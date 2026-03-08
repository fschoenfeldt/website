#!/bin/bash

set -e

echo "=== Dry run ==="
lftp -c "
  open ftp://$FTP_USER:$FTP_PASSWORD@$FTP_HOST
  set mirror:parallel-transfer-count 8
  mirror --reverse --verbose --dry-run --parallel=5 _site/ $FTP_SUBDIR
  bye
"

read -r -p "Deploy? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

echo "=== Deploying ==="
lftp -c "
  open ftp://$FTP_USER:$FTP_PASSWORD@$FTP_HOST
  set mirror:parallel-transfer-count 8
  mirror --reverse --verbose --parallel=5 _site/ $FTP_SUBDIR
  bye
"
