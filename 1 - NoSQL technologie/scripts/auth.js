#!/bin/bash

mongosh <<EOF
use admin;

// Create admin user with full cluster access
db.createUser({user: "admin", pwd: "big2025", roles:[{role: "root", db: "admin"}]});

// Authenticate as the admin user
db.auth("admin", "big2025");

// Switch to eshop database
use eshop;
// User manager for eshop.users collection
db.createUser({
  user: "user_manager",
  pwd: "userpass2025",
  roles: [{ role: "readWrite", db: "eshop", collection: "users" }]
});

// Product manager for eshop.products collection
db.createUser({
  user: "product_manager",
  pwd: "productpass2025",
  roles: [{ role: "readWrite", db: "eshop", collection: "products" }]
});

// Order processor for eshop.orders collection
db.createUser({
  user: "order_processor",
  pwd: "orderpass2025",
  roles: [{ role: "readWrite", db: "eshop", collection: "orders" }]
});

exit;
EOF