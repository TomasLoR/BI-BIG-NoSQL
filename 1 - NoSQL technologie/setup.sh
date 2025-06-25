#!/bin/bash

echo "Starting MongoDB Sharded Cluster Initialization..."

# Step 2: Initialize config servers and shards
echo "Initializing config server..."
docker compose exec configsvr01 bash "/scripts/init-configserver.js"

echo "Initializing shards..."
docker compose exec shard01-a bash "/scripts/init-shard01.js"
docker compose exec shard02-a bash "/scripts/init-shard02.js"
docker compose exec shard03-a bash "/scripts/init-shard03.js"

# Wait for primaries to be elected
echo "Waiting 10 seconds for primaries to be elected..."
sleep 10

# Step 3: Initialize router
echo "Initializing router and setting up sharding..."
docker compose exec router01 sh -c "mongosh < /scripts/init-router.js"

# Step 4: Setup authentication
echo "Setting up authentication..."
echo "Credentials can be found in /scripts/auth.js"
docker compose exec configsvr01 bash "/scripts/auth.js"
docker compose exec shard01-a bash "/scripts/auth.js"
docker compose exec shard02-a bash "/scripts/auth.js"
docker compose exec shard03-a bash "/scripts/auth.js"

# Step 5: Configure collection sharding
echo "Configuring collection sharding..."
docker cp ./scripts/sharding.js router01:/scripts/sharding.js
#docker compose exec router01 mongosh --host router01:27017 -u "admin" -p "big2025" --authenticationDatabase admin --file /scripts/sharding.js
#docker exec -it router01 mongosh --port 27017 -u "admin" -p "big2025" --authenticationDatabase admin eshop /scripts/sharding.js
#docker exec router01 sh -c "mongosh -u "admin" -p "big2025" --authenticationDatabase admin < /scripts/sharding.js"
docker compose exec router01 mongosh --host router01:27017 -u "admin" -p "big2025" --authenticationDatabase admin --eval 'load("/scripts/sharding.js")'


# Step 6: Import data
echo "Copying data files to router01..."
docker cp ./data/users.json router01:/tmp/users.json
docker cp ./data/products.json router01:/tmp/products.json
docker cp ./data/orders.json router01:/tmp/orders.json

echo "Importing data into eshop database..."
docker exec -it router01 mongoimport --port 27017 -u "admin" -p "big2025" --authenticationDatabase admin -d eshop -c users --file /tmp/users.json --jsonArray
docker exec -it router01 mongoimport --port 27017 -u "admin" -p "big2025" --authenticationDatabase admin -d eshop -c products --file /tmp/products.json --jsonArray
docker exec -it router01 mongoimport --port 27017 -u "admin" -p "big2025" --authenticationDatabase admin -d eshop -c orders --file /tmp/orders.json --jsonArray