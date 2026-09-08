#!/bin/bash

set -e

PARALLEL=5

# Run lftp mirror against the FTP target. Extra args are passed to `mirror`.
lftp_mirror() {
  lftp -c "
    open ftp://$FTP_USER:$FTP_PASSWORD@$FTP_HOST
    set cmd:show-status no
    set mirror:set-permissions no
    mirror --reverse --parallel=$PARALLEL $* _site/ $FTP_SUBDIR
    bye
  "
}

# Turn raw lftp commands into a readable plan and hide credentials.
prettify() {
  sed -E \
    -e 's#://[^/@]*@#://#g' \
    -e 's#^(put|get)( -e)?( -O [^ ]+)? +(.*)$#  upload  \4#' \
    -e 's#^mkdir( -[^ ]+)* +(.*)$#  mkdir   \2#' \
    -e 's#^rm( -[^ ]+)* +(.*)$#  delete  \2#' \
    -e '/^chmod /d'
}

echo "=== Dry run ==="
plan=$(lftp_mirror --dry-run | prettify)

if [[ -z "$plan" ]]; then
  echo "Nothing to do — remote is up to date."
  exit 0
fi

echo "$plan"
echo
echo "$(grep -c '^  upload' <<<"$plan") file(s) to upload, $(grep -c '^  mkdir' <<<"$plan") dir(s) to create."
echo

read -r -p "Deploy? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

echo "=== Deploying ==="
lftp_mirror --verbose=1
