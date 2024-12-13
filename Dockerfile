FROM ubuntu:24.10

LABEL org.opencontainers.image.authors="mosab.a.ibrahim@gmail.com"
LABEL org.opencontainers.image.description="An ubnutu image with lualatex installed"
LABEL org.opencontainers.image.licenses=MIT
LABEL org.opencontainers.image.source="https://github.com/mos3abof/mos3abof.github.io"

# Construct url for zola binary
ENV ZOLA_VERSION="0.19.2"
ENV ZOLA_URL="https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"

# Install apt packages
#   - wget: to download the required zola binary release
#   - git: is used by `peaceiris/actions-gh-pages` in github actions
#   - texlive and texlive-full: for building the resume using lualatex
#   - make: commads are configured for building the website and resume
# Delete apt-get list files
# Install zola binary
RUN apt-get update && \
  apt-get install make=4.3-4.1build2 \
  wget=1.24.5-1ubuntu2 \
  texlive=2024.20240706-1 \
  texlive-full=2024.20240706-1 \
  git=1:2.45.2-1ubuntu1 \
  --no-install-recommends \
  -y && \
  rm -rf /var/lib/apt/lists/* && \
  wget --progress=dot ${ZOLA_URL} && \
  tar xzf "zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz" -C /usr/local/bin 

CMD ["make all"]
ENTRYPOINT [ "zola" ]
