#!/bin/bash
while IFS='|' read -r slug tr en type city; do
  slug=$(echo "$slug"|tr -d ' '); tr=$(echo "$tr"|xargs); 
  dom=$(echo "$slug" | sed 's/-university//;s/-universitesi//')
  echo "=== $slug ==="
done < /dev/null
