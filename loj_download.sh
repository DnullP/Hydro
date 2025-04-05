node node_modules/@hydrooj/loj-download/bin/loj-download.js https://loj.ac/p/$1

zip -r node_modules/@hydrooj/loj-download/downloads/compressed_p/$1 node_modules/@hydrooj/loj-download/downloads/loj.ac/$1

node node_modules/hydrooj/bin/hydrooj.js cli problem import system node_modules/@hydrooj/loj-download/downloads/compressed_p/$1.zip