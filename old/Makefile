BASEDIR=$(CURDIR)
OUTPUTDIR=$(BASEDIR)/public

SSH_HOST=mosab.co.uk
SSH_PORT=22
SSH_USER=mosab
SSH_TARGET_DIR=/home/mosab/mosab.co.uk

GITHUB_PAGES_BRANCH=master

rsync_upload:
	rsync -e "ssh -p $(SSH_PORT)" -P -rvzc --cvs-exclude --delete -e "ssh -o StrictHostKeyChecking=no" $(OUTPUTDIR)/ $(SSH_USER)@$(SSH_HOST):$(SSH_TARGET_DIR)

.PHONY: rsync_upload
