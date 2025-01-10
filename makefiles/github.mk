# Build website using zola
build-zola:
	# Build site
	zola build

	# Create a CNAME file for domain name owenship verficiation
	$(MAKE) create-cname-file
