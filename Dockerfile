FROM node:16

USER node
WORKDIR /home/node

COPY . /home/node

RUN yarn install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

CMD ["yarn", "start"]
