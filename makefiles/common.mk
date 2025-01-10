IMAGE = ghcr.io/mos3abof/ubuntu-lualatex
TAG = latest

## [START] Common Make commands
# Recompile css files
compile-css:
	npx tailwindcss -i styles/input.css -o static/css/style.css

# Build resume using lualatex
build-resume:
	cd resume; lualatex MosabIbrahim.tex
	cp ./resume/MosabIbrahim.pdf ./static/files/MosabIbrahim.pdf

# Copy fonts
copy-fonts:
	mkdir -p ./static/fonts
	cp -r ./fonts/* ./static/fonts/

# Create a CNAME file needed for domain owbership verification.
create-cname-file:
	echo "mosab.co.uk" > ./public/CNAME

# Clean generated files locally
clean-files:
	rm -rf ./public/* 
	rm -rf ./static/fonts/*
## [END] Common Make commands
