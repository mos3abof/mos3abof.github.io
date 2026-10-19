BASE_URL ?= https://web.mosab.me
INTERFACE ?= 0.0.0.0
PORT ?= 1111

# Copy files to nginx directory: on the server itself, or, from a Mac, to the
# devserver over ssh. From the Mac, sudo runs on the server's side only, so the
# local rsync keeps your own ssh config and keys.
NGINX_DIR ?= /var/www/web.mosab.me

ifeq ($(shell uname -s),Darwin)
NGINX_TARGET ?= devserver:$(NGINX_DIR)
NGINX_RSYNC ?= rsync --rsync-path="sudo rsync"
else
NGINX_TARGET ?= $(NGINX_DIR)
NGINX_RSYNC ?= sudo rsync
endif

copy-to-nginx:
	$(NGINX_RSYNC) -az --recursive --delete ./public/ $(NGINX_TARGET)

# Build site and copy generated files to the nginx directory
build-zola:
	# Recompile css files
	$(MAKE) compile-css

	# Build site
	zola build --base-url=$(BASE_URL)

	# Copy generated site to nginx directory
	$(MAKE) copy-to-nginx

# Serve zola
serve-zola:
	zola serve --interface ${LOCAL_SERVE_IF} --port 1111
