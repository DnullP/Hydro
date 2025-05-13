FROM node:18 

# Create app directory
WORKDIR /app

COPY . /app
RUN apt update && apt install zip && mv /app/.hydro ~ && chmod 777 loj_download.sh && cd /app/loj-download && npm i

# Run app
CMD ["node", "./node_modules/hydrooj/bin/hydrooj.js", "--port=8888", "--host=0.0.0.0"]
