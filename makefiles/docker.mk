IMAGE=ghcr.io/mos3abof/ubuntu-lualatex
TAG=latest

# Build website using dockerized zola
build-zola:
	docker run \
		--rm \
		-v .:/app \
		--workdir /app \
		$(IMAGE):$(TAG) \
		build

# Serve website from a dockerized zola
serve-zola:
	docker run \
		--rm \
		-v .:/app \
		--workdir /app \
		$(IMAGE):$(TAG) \
		serve \
		--interface 0.0.0.0 \
		--port 1111

# Debugging docker
debug-zola:
	docker run \
		--rm \
		-t \
		-v .:/app \
		--workdir /app \
		$(IMAGE):$(TAG) \
		--version

# Build docker image
build-docker-image:
	docker build . -t $(IMAGE):$(TAG)

# Pull image
pull-docker-image:
	docker pull $(IMAGE):$(TAG)

# Publish image
publish-docker-image:
	docker push $(IMAGE):$(TAG)
