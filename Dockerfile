FROM node:alpine

RUN apk update && \
    apk upgrade

COPY --chown=node:node ./subscriber /opt/subscriber/
WORKDIR /opt/subscriber
RUN npm install
RUN npm rebuild
USER node

CMD node subscriber.js
