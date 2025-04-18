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

	# Comment out for now.
	#$(MAKE) build-resume

.PHONY: all build
