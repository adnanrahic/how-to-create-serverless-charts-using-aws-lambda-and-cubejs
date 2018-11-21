build:
	docker build -t generate-cubejs-chart .
	docker run -d generate-cubejs-chart
	sleep 3
	docker cp $$(docker ps -q -f ancestor=generate-cubejs-chart):/root/functions/node_modules ./node_modules
	docker stop $$(docker ps -q -f ancestor=generate-cubejs-chart)
	docker rm $$(docker ps -a -q -f ancestor=generate-cubejs-chart)

.PHONY: clean
clean:
	rm -rf node_modules

.PHONY: deploy
deploy: clean build
	sls deploy --verbose