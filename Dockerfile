FROM mcr.microsoft.com/playwright:v1.54.1-noble

RUN apt-get update \
    && apt-get install -y build-essential libvips-dev \
    && npm i -g pnpm
WORKDIR /work