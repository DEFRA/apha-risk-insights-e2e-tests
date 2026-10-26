FROM node:24.14.1-slim

ENV TZ="Europe/London"

# Root is required: Playwright installs OS packages and the CDP runner writes reports.
USER root

RUN apt-get update -qq \
    && apt-get install -qqy curl zip unzip ca-certificates \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip -q awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws

WORKDIR /app

# .dockerignore excludes node_modules, .git and other local files.
COPY . .
RUN npm install \
    && npx playwright install --with-deps chromium

ENTRYPOINT [ "./entrypoint.sh" ]

# This is downloading the linux amd64 aws cli. For M1 macs build and run with the --platform=linux/amd64 argument. eg docker build . --platform=linux/amd64
