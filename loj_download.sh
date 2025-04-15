timeout 10s node loj-download/bin/loj-download.js "https://loj.ac/p/$1"

zip -r loj-download/downloads/compressed_p/$1 loj-download/downloads/loj.ac/$1

node node_modules/hydrooj/bin/hydrooj.js cli problem import system loj-download/downloads/compressed_p/$1.zip