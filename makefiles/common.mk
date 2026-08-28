IMAGE = ghcr.io/mos3abof/ubuntu-lualatex
TAG = latest

## [START] Common Make commands
# Recompile css files
compile-css:
	npx tailwindcss -i styles/input.css -o static/css/style.css

# Build resume using lualatex, then remove the (gitignored) LaTeX temp files
build-resume:
	cd resume; TEXINPUTS="./lib:" lualatex MosabIbrahim.tex
	cp ./resume/MosabIbrahim.pdf ./static/files/MosabIbrahim.pdf
	cd resume; rm -f *.aux *.lof *.log *.lot *.fls *.out *.toc *.bbl *.bcf *.blg *.run.xml *.fdb_latexmk *.synctex *.synctex.gz *.pdfsync *.nav *.snm *.vrb *.xdv

# Copy fonts
copy-fonts:
	mkdir -p ./static/fonts
	cp -r ./fonts/* ./static/fonts/
	cp ./fonts/arabic/font-faces.css ./static/css/font-faces.css

# Create a CNAME file needed for domain owbership verification.
create-cname-file:
	echo "mosab.co.uk" > ./public/CNAME

# Clean generated files locally
clean-files:
	rm -rf ./public/* 
	rm -rf ./static/fonts/*
## [END] Common Make commands
