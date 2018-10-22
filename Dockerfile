FROM node:alpine

COPY --chown=node:node ./subscriber /opt/subscriber/
WORKDIR /opt/subscriber
RUN npm install
USER node

CMD node subscriber.js
