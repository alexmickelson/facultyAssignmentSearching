FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    fish git \
    nodejs npm curl
RUN npm install -g n \
    && n stable \
    && npm install -g pnpm

WORKDIR /app
    
RUN usermod -l developer ubuntu && \
    usermod -d /home/developer -m developer && \
    groupmod -n developer ubuntu && \
    chsh -s /usr/bin/fish developer


COPY ./config.fish /home/developer/.config/fish/config.fish

CMD ["tail", "-f", "/dev/null"]