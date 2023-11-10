FROM "node:20-alpine"

WORKDIR "/usr/src/app"

COPY . .

RUN npm install && \
    npm run init && \
    rm /usr/src/app/.env

RUN apk update && \
    apk add clamav && \
    mkdir -p /run/clamav && \
    chown clamav:clamav /run/clamav && \
    freshclam

EXPOSE 3000

CMD clamd && npm run init && npm start