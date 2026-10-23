#!/bin/bash
# usage: wiki.sh "Title With Spaces" outfile
t=$(echo "$1" | sed 's/ /_/g')
curl -skL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" --max-time 30 --get --data-urlencode "title=$t" --data-urlencode "action=raw" "https://tr.wikipedia.org/w/index.php" -o "$2"
wc -c "$2"
