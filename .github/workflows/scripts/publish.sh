#!/usr/bin/env bash

set -e
set -o pipefail

PUBLISH_CMD="npm publish --tag $PUBLISH_NPM_TAG"

IS_MONOREPO="$1"

set -x

if [[ -z $PUBLISH_NPM_TAG ]]; then
  echo "Notice: 'npm-tag' not set."
  exit 1
fi

CURRENT_PACKAGE_VERSION=$(jq --raw-output .version package.json)

if [[ "$CURRENT_PACKAGE_VERSION" = "0.0.0" ]]; then
  echo "Notice: Invalid version: $CURRENT_PACKAGE_VERSION. aborting publish."
  exit 0
fi

# check param, if it's set (monorepo) we check if it's published before proceeding
if [[ -n "$IS_MONOREPO" ]]; then
  # check if module is published
  PACKAGE_NAME=$(jq --raw-output .name package.json)
  LATEST_PACKAGE_VERSION=$(npm view "$PACKAGE_NAME" dist-tags --workspaces false --json | jq --raw-output --arg tag "$PUBLISH_NPM_TAG" '.[$tag]' || echo "")

  if [ "$LATEST_PACKAGE_VERSION" = "$CURRENT_PACKAGE_VERSION" ]; then
    echo "Notice: This module is already published at $CURRENT_PACKAGE_VERSION. aborting publish."
    exit 0
  fi
fi

$PUBLISH_CMD