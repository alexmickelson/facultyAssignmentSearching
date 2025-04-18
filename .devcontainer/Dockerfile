FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    git fish \
    nodejs npm curl
RUN npm install -g n \
    && n stable \
    && npm install -g pnpm

WORKDIR /app

RUN usermod -l developer ubuntu && \
    groupmod -n developer ubuntu && \
    usermod -d /home/developer -m developer && \
    chsh -s /usr/bin/fish developer


USER developer

RUN fish

COPY ./config.fish /home/developer/.config/fish/config.fish

CMD ["tail", "-f", "/dev/null"]