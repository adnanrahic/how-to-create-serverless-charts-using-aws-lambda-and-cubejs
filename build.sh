docker build -t generate-cubejs-chart .
docker run -d generate-cubejs-chart
sleep 5
echo $(docker ps -q -f ancestor=generate-cubejs-chart) 
c=$(docker ps -q -f ancestor=generate-cubejs-chart)
docker cp $c:/root/node_modules ./node_modules