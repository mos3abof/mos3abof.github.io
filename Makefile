# The default target
all: build

IMAGE=ghcr.io/mos3abof/ubuntu-lualatex
TAG=latest

#############################
#   Commands using Docker
#############################

# Build website using dockerized zola
docker-zola-build:
	docker run \
		--rm \
		-v .:/app \
		--workdir /app \
		$(IMAGE):$(TAG) \
		build

# Serve website from a dockerized zola
docker-zola-serve:
	docker run \
		--rm \
		-v .:/app \
		--workdir /app \
		$(IMAGE):$(TAG) \
		serve \
		--interface 0.0.0.0 \
		--port 1111

# Debugging docker
docker-debug:
	docker run \
		--rm \
		-t \
		-v .:/app \
		--workdir /app \
		$(IMAGE):$(TAG) \
		--version

# Build docker image
docker-image-build:
	docker build . -t $(IMAGE):$(TAG)

# Pull image
docker-image-pull:
	docker pull $(IMAGE):$(TAG)

# Pull image
docker-image-publish:
	docker push $(IMAGE):$(TAG)

#############################
#   Baremetal Commands
#############################

# Build website using zola
zola-build:
	zola build
	echo "mosab.co.uk" > ./public/CNAME

# Zola serve
zola-serve:
	zola serve --interface 0.0.0.0 --port 1111
	
# Build resume using lualatex
resume-build:
	cd resume; lualatex MosabIbrahim.tex
	cp ./resume/MosabIbrahim.pdf ./static/files/MosabIbrahim.pdf

#############################
#   General Commands
#############################

# Build the resume and the website
build: zola-build resume-build

.PHONY: all zola-build resume-build
