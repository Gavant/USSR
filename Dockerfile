ARG FUNCTION_DIR="/var/task/"

FROM node:18.16-bullseye as build-image
RUN apt-get update && apt-get install -y chromium

# Install Dependencies
ENV NPM_CONFIG_CACHE=/tmp/.npm
RUN apt-get update && \
    apt-get install -y wget curl ca-certificates rsync \
    libtool autoconf automake make cmake g++ unzip \
    libcurl4-openssl-dev

ARG FUNCTION_DIR

# Copy function code
RUN mkdir -p ${FUNCTION_DIR}
COPY . ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

# Install the runtime interface client
RUN npm install aws-lambda-ric

# Install function dependencies
RUN npm install

# Grab a fresh slim copy of the image to reduce the final size
FROM node:18.16-bullseye
ENV NPM_CONFIG_CACHE=/tmp/.npm

ARG FUNCTION_DIR
WORKDIR ${FUNCTION_DIR}

# Copy in the built dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD [ "dist/main.handler" ]
