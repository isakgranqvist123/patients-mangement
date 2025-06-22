FROM node:24-alpine3.21

WORKDIR /usr/src/app

ARG MONGO_URI
ARG JWT_SECRET

ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET


COPY . .

RUN npm install
RUN npm run build

EXPOSE 80
CMD ["node", "dist/main.js"]