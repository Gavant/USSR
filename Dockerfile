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
RUN apt-get update && apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget chromium
ENV NPM_CONFIG_CACHE=/tmp/.npm

ARG FUNCTION_DIR
WORKDIR ${FUNCTION_DIR}

# Copy in the built dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD [ "dist/main.handler" ]
