FROM node:18 

# Create app directory
WORKDIR /app

COPY . /app
RUN mv /app/.hydro ~

# Run app
CMD ["node", "/app/node_modules/hydrooj/bin/hydrooj.js", "--port=8888", "--host=0.0.0.0"]