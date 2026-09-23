IMAGE = ghcr.io/mos3abof/ubuntu-lualatex
TAG = latest

# Resume build settings
RESUME_DIR ?= resume
RESUME_NAME ?= MosabIbrahim

# Where lualatex looks for russell.cls and lib/templates/. The `//` searches
# lib/ recursively, the trailing `:` keeps the default TeX search paths.
RESUME_TEXINPUTS ?= ./lib//:

# Never wait for input on a LaTeX error: stop at the first one and exit non-zero
# so make actually fails instead of hanging on the `Enter file name:` prompt.
LUALATEX ?= lualatex -interaction=nonstopmode -halt-on-error -file-line-error

# The (gitignored) LaTeX temp files produced next to the PDF.
RESUME_TMP_EXT = aux lof log lot fls out toc bbl bcf blg run.xml fdb_latexmk \
	synctex synctex.gz pdfsync nav snm vrb xdv

## [START] Common Make commands
# Recompile css files
compile-css:
	npx tailwindcss -i styles/input.css -o static/css/style.css

# Build resume using lualatex, then remove the (gitignored) LaTeX temp files.
# Runs twice so hyperref bookmarks and the page numbers in the footer settle;
# the first pass writes the .aux/.out files that the second pass reads back.
build-resume:
	cd $(RESUME_DIR) && TEXINPUTS="$(RESUME_TEXINPUTS)" $(LUALATEX) $(RESUME_NAME).tex
	cd $(RESUME_DIR) && TEXINPUTS="$(RESUME_TEXINPUTS)" $(LUALATEX) $(RESUME_NAME).tex
	mkdir -p ./static/files
	cp ./$(RESUME_DIR)/$(RESUME_NAME).pdf ./static/files/$(RESUME_NAME).pdf
	$(MAKE) clean-resume

# Remove the LaTeX temp files, but keep the generated PDF
clean-resume:
	cd $(RESUME_DIR) && rm -f $(addprefix $(RESUME_NAME).,$(RESUME_TMP_EXT))

# Copy fonts
copy-fonts:
	mkdir -p ./static/fonts
	cp -r ./fonts/* ./static/fonts/
	cp ./fonts/arabic/font-faces.css ./static/css/font-faces.css

# Create a CNAME file needed for domain owbership verification.
create-cname-file:
	mkdir -p ./public
	echo "mosab.co.uk" > ./public/CNAME

# Clean generated files locally
clean-files: clean-resume
	rm -rf ./public/*
	rm -rf ./static/fonts/*

.PHONY: compile-css build-resume clean-resume copy-fonts create-cname-file clean-files
## [END] Common Make commands
