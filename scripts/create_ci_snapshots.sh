#!/bin/bash
set -e

pnpm install
pnpm playwright test --update-snapshots