#!/bin/bash

OUTPUT_FILE="project_dump.txt"

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

> "$OUTPUT_FILE"

find . \
  \( -type d \( -name ".git" -o -name "node_modules" -o -name ".yarn" \) -prune \) \
  -o \( -type f -print \) | while IFS= read -r file; do

  echo "==============================" >> "$OUTPUT_FILE"
  echo "FILE: $file" >> "$OUTPUT_FILE"

  cat "$file" 2>/dev/null >> "$OUTPUT_FILE"
  echo -e "\n\n" >> "$OUTPUT_FILE"

done

echo "Готово! Данные сохранены в $OUTPUT_FILE"