#!/usr/bin/env bash
#
# Thin wrapper around `pnpm exec changeset`. Passes all arguments through.

set -e

exec pnpm exec changeset "$@"
