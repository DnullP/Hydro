FROM node:18 

# Create app directory
WORKDIR /app

COPY . /app

RUN npm i

# Run app
CMD [ "node /app/node_modules/hydrooj/bin/hydrooj.js" ]