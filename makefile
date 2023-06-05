git:
	git reset --hard HEAD 
	git pull
	git status
	npm i
build:
	npm run build
	rm -Rf /var/www/html/*
	cp -r dist/* /var/www/html/
all:
	sudo make git
	sudo make build