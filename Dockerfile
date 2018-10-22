FROM node:alpine

COPY --chown=node:node ./subscriber /opt/subscriber/
WORKDIR /opt/subscriber
RUN npm install
RUN npm rebuild
USER node

CMD node subscriber.js
