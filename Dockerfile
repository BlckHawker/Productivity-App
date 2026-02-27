FROM node:alpine AS root

WORKDIR /build/

COPY frontend/ /build/frontend/
COPY backend/ /build/backend/
COPY docker/ /docker/
COPY eslint.config.ts /build/
COPY package.json /build/
COPY .prettierrc /build/

RUN npm install
RUN npm install frontend/
RUN npm install backend/

ENTRYPOINT ["/docker/entrypoint.sh"]

FROM node:alpine AS frontend

WORKDIR /build/

COPY frontend/ /build/
COPY docker/ /docker/

RUN npm install

ENTRYPOINT ["/docker/entrypoint.sh"]

FROM node:alpine AS backend

WORKDIR /build/

COPY backend/ /build/
COPY docker/ /docker/

RUN npm install

ENTRYPOINT ["/docker/entrypoint.sh"]
