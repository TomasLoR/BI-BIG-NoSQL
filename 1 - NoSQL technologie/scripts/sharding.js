// Pure JavaScript MongoDB sharding configuration script

// Switch to eshop database
db = db.getSiblingDB("eshop");

// Create collections first
db.createCollection("users");
db.createCollection("products");
db.createCollection("orders");

// Enable sharding for the database
sh.enableSharding("eshop");

// Create indexes
db.users.createIndex({ "_id": "hashed" });
db.products.createIndex({ "_id": "hashed" });
db.orders.createIndex({ "user_id": 1 });

// Shard collections with appropriate keys
sh.shardCollection("eshop.users", { "_id": "hashed" });
sh.shardCollection("eshop.products", { "_id": "hashed" });
sh.shardCollection("eshop.orders", { "user_id": 1 });

// Verify sharding configuration
print("Verifying sharding for users collection:");
printjson(db.getSiblingDB("config").collections.findOne({ _id: "eshop.users" }));

print("Verifying sharding for products collection:");
printjson(db.getSiblingDB("config").collections.findOne({ _id: "eshop.products" }));

print("Verifying sharding for orders collection:");
printjson(db.getSiblingDB("config").collections.findOne({ _id: "eshop.orders" }));