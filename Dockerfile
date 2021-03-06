FROM ubuntu:trusty
MAINTAINER Thishan D Pathmanathan <thishandp7@gmail.com>

ENV TERM=xterm-256color

RUN apt-get update && \
    apt-get install curl -y && \
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    apt-get install -y nodejs

COPY . /app
WORKDIR /app

RUN npm install -g mocha && \
    npm install

ENTRYPOINT ["mocha"]
