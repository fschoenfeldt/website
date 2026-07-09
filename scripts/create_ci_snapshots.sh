#!/bin/bash
set -e

# HOME must point somewhere writable by
# that uid so pnpm's store and node-gyp's devdir have a home.
export HOME=/tmp
CI=true npm_config_unsafe_perm=true pnpm install
pnpm build
pnpm playwright test --update-snapshots