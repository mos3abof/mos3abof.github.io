# The default target
all: build

# Build the resume and the website
build: website resume

website:
	zola build && echo "mosab.co.uk" > ./public/CNAME

resume:
	cd resume; lualatex MosabIbrahim.tex
	pwd
	cp ./resume/MosabIbrahim.pdf ./static/files/MosabIbrahim.pdf

.PHONY: all website resume
