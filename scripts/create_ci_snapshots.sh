#!/bin/bash
set -e

CI=true npm_config_unsafe_perm=true pnpm install
pnpm playwright test --update-snapshots