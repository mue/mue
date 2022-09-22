#!/bin/sh
. "${dirname "$0"}/_/husky/husky.sh"

npx commitlint --edit $1