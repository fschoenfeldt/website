FROM mcr.microsoft.com/playwright:v1.60.0-noble

RUN apt-get update \
    && apt-get install -y build-essential libvips-dev \
    && npm i -g pnpm
WORKDIR /work