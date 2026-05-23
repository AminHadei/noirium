#!/usr/bin/env bash

set -euo pipefail

FILE="dist/lib/core.css"

if [ ! -f "$FILE" ]; then
  echo "❌ File not found: $FILE"
  exit 1
fi

# Prefix-based allow list (starts with)
ALLOWED_PREFIXES=(
  vc-
  i-
  uno-
)

# Exact match allow list (full selector without dot)
ALLOWED_CLASSES=(
  "noirium-datepicker"
  "form-main-input"
  "h2"
  "h3"
  "h4"
  "h6"
  "outline"
  "px"
  "static"
  "visible"
)

# Extract `.class(.class)* {`
matches=$(grep -oE '\.[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\s*\{' "$FILE" \
  | sed 's/[[:space:]]*{//' \
  | sed 's/^\.//')

invalid=()

for cls in $matches; do

  allowed=false

  # Check exact allow list
  for safe in "${ALLOWED_CLASSES[@]}"; do
    if [[ "$cls" == "$safe" ]]; then
      allowed=true
      break
    fi
  done

  # Check prefix allow list
  if [ "$allowed" = false ]; then
    for prefix in "${ALLOWED_PREFIXES[@]}"; do
      if [[ "$cls" == "$prefix"* ]]; then
        allowed=true
        break
      fi
    done
  fi

  # If not allowed → mark invalid
  if [ "$allowed" = false ]; then
    invalid+=("$cls")
  fi

done

# Remove duplicates
unique_invalid=$(printf "%s\n" "${invalid[@]+"${invalid[@]}"}" | sort -u)

if [ -n "$unique_invalid" ]; then
  echo "❌ Invalid raw class selectors found:"
  echo ""

  while IFS= read -r cls; do
    echo "  • .$cls"
  done <<< "$unique_invalid"

  echo ""
  echo "👉 Only compiled/allowed selectors should exist."

  exit 1
fi

echo "✅ CSS check passed"
