install:
	rsync -avz ./ mosab@mos3abof.com:~/mos3abof.com --exclude ".idea*" --exclude ".git*" --exclude ".gitignore" --exclude "README.md" --exclude "Makefile" --delete
