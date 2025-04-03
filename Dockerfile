FROM node:18 

# Create app directory
WORKDIR /app

COPY . /app

# Run app
CMD [ "node ./node_modules/hydrooj/bin/hydrooj.js" ]