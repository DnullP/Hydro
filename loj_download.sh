cd ./packages/loj-download/bin/
node loj-download.js https://loj.ac/p/$1
cd ../../..

cd ./packages/loj-download/downloads/loj.ac
zip -r ../../../../compressed_p/$1 ./$1
cd ../../../../

yarn hydrooj cli problem import system ./compressed_p/$1.zip