BASE_URL ?= https://we.mosab.me
INTERFACE ?= 0.0.0.0
PORT ?= 1111

# Copy files to nginx directory
copy-to-nginx:
	sudo rsync -az --recursive --delete ./public/ /var/www/web.mosab.me

# Build site and copy generated files to the nginx directory
build-zola:
	# Recompile css files
	$(MAKE) compile-css

	# Build site
	zola build --base-url=https://web.mosab.me

	# Copy generated site to nginx directory
	$(MAKE) copy-to-nginx

# Serve zola
serve-zola:
	zola serve --interface ${LOCAL_SERVE_IF} --port 1111
