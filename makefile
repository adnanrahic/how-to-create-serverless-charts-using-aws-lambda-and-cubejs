build:
	docker build -t ami .
	docker run -d ami
	sleep 3
	docker cp $$(docker ps -q -f ancestor=ami):/root/functions/node_modules ./node_modules
	docker stop $$(docker ps -q -f ancestor=ami)
	docker rm $$(docker ps -a -q -f ancestor=ami)

offline:
	docker build -t ami -f Dockerfile.offline .
	docker run -p 3000:3000 ami

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: deploy
deploy: clean build
	sls deploy --verbose