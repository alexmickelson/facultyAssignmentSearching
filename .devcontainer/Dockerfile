FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    git fish \
    sudo \
    nodejs npm curl

    
RUN npm install -g n \
    && n stable \
    && npm install -g pnpm
    
WORKDIR /app
    
RUN usermod -l developer ubuntu && \
    groupmod -n developer ubuntu && \
    usermod -d /home/developer -m developer && \
    chsh -s /usr/bin/fish developer
    
RUN echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER developer

RUN fish

COPY ./config.fish /home/developer/.config/fish/config.fish

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="$HOME/.local/bin:$PATH"

CMD ["tail", "-f", "/dev/null"]l