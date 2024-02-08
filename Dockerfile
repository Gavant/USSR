ARG FUNCTION_DIR="/var/task/"

FROM node:18.16-bullseye as build-image
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

# Copy in the built dependencies
ARG FUNCTION_DIR
WORKDIR ${FUNCTION_DIR}
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ENV NPM_CONFIG_CACHE=/tmp/.npm

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD [ "dist/main.handler" ]
