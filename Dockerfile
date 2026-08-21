FROM mcr.microsoft.com/playwright:v1.60.0-noble

RUN apt-get update \
    && apt-get install -y build-essential libvips-dev \
    && npm i -g pnpm
WORKDIR /work

# The container gets its own node_modules via an anonymous volume
# (`-v /work/node_modules`). Docker initialises that volume from this directory,
# including its permissions, so make it world-writable: the container is run
# with `--user $(id -u):$(id -g)`, which is not a user that exists in the image.
RUN mkdir -p /work/node_modules && chmod 777 /work/node_modules
