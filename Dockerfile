FROM node:18 

# Create app directory
WORKDIR /app

COPY . /app
RUN mv /app/.hydro ~ && chmod 777 loj_download.sh && npm i && cd /app/loj-download && npm i

# Run app
CMD ["node", "/app/node_modules/hydrooj/bin/hydrooj.js", "--port=8888", "--host=0.0.0.0"]