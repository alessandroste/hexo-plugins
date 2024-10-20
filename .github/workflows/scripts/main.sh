#!/usr/bin/env bash

if [ "${ACTIONS_RUNNER_DEBUG}" = "true" ]; then
  set -x
fi
set -e
set -o pipefail

script_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [[ "$(jq 'has("workspaces")' package.json)" = "true" ]]; then
  echo "Notice: workspaces detected. Treating as monorepo."
  npm x -c "$script_path/publish.sh true" --ws
  exit 0
fi

echo "Notice: no workspaces detected. Treating as polyrepo."
"${script_path}"/publish.sh