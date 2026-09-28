# Default build mode is "local"
# Allowed values are:
# - local
# - docker
# - github
all: build

# Determines which makefiles to include.
# Can be provided/overriddent by either environment variables or via the cli invocation of `make`.
BUILD_MODE ?= local

# Include files from ./Makefiles/
# - common.mk
# - $(BUILD_MODE).mk
#
#  The interface expected in every file is at least:
#  - build-zola
include makefiles/common.mk makefiles/$(BUILD_MODE).mk

# Build the world!
build:
	echo "Building the world. mode=${BUILD_MODE}"

	# We always want to copy fonts.
	$(MAKE) copy-fonts

	# Run the build-zola step defined in the ${BUILD_MODE} file.
	$(MAKE) build-zola 

	# Deliberately left commented out. `make build` runs in CI too, where there is
	# no lualatex, and this step sits after build-zola anyway, so a PDF rebuilt
	# here would land in static/files/ after zola had already produced public/.
	# Build the resume with `make resume` instead.
	#$(MAKE) build-resume

	# Reminder, printed last so it is the final thing on screen. It is aimed at a
	# human at a terminal, so it is skipped on CI: GitHub Actions always sets
	# GITHUB_ACTIONS, and most other providers set CI. printf rather than echo -e,
	# so the escapes survive dash as well as bash. The box has no right-hand
	# border on purpose: the emoji is two columns wide but one character to
	# printf, so a closing border could never be made to line up.
ifeq ($(strip $(CI)$(GITHUB_ACTIONS)),)
	@printf '\n\033[90m ╭─\033[0m \033[1;33m📄  Resume not rebuilt\033[0m \033[90m─────────────────────────────────\033[0m\n'
	@printf '\033[90m │\033[0m  \033[32m➜\033[0m  run \033[1;36mmake resume\033[0m if you changed anything under \033[1mresume/\033[0m\n'
	@printf '\033[90m ╰──────────────────────────────────────────────────────────\033[0m\n\n'
endif

# Build only the resume PDF with lualatex, then copy it into static/files/.
# build-resume is defined in makefiles/common.mk.
resume: build-resume

.PHONY: all build resume
