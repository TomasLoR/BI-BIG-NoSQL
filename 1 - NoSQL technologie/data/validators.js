db = db.getSiblingDB("eshop");
// Validator for users collection
db.runCommand({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "email", "age", "address", "preferences", "created_at"],
        properties: {
          _id: {
            bsonType: "number",
            minimum: 1,
            description: "must be a positive integer"
          },
          name: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            description: "must be a valid email address"
          },
          age: {
            bsonType: "number",
            minimum: 18,
            maximum: 120,
            description: "must be a number between 18 and 120"
          },
          address: {
            bsonType: "object",
            required: ["street", "city", "state", "zipcode", "country"],
            properties: {
              street: {
                bsonType: "string",
                description: "must be a string"
              },
              city: {
                bsonType: "string",
                description: "must be a string"
              },
              state: {
                bsonType: "string",
                minLength: 2,
                maxLength: 2,
                description: "must be a 2-character string"
              },
              zipcode: {
                bsonType: "string",
                pattern: "^\\d{5}$",
                description: "must be a 5-digit string"
              },
              country: {
                bsonType: "string",
                description: "must be a string"
              }
            }
          },
          preferences: {
            bsonType: "object",
            required: ["newsletter", "theme", "notifications"],
            properties: {
              newsletter: {
                bsonType: "bool",
                description: "must be a boolean"
              },
              theme: {
                enum: ["light", "dark"],
                description: "must be either 'light' or 'dark'"
              },
              notifications: {
                bsonType: "object",
                required: ["email", "sms"],
                properties: {
                  email: {
                    bsonType: "bool",
                    description: "must be a boolean"
                  },
                  sms: {
                    bsonType: "bool",
                    description: "must be a boolean"
                  }
                }
              }
            }
          },
          created_at: {
            bsonType: "string",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3,6}$",
            description: "must be an ISO date string"
          }
        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
});

// Validator for products collection
db.runCommand({
    collMod: "products",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "name", "price", "category", "last_updated"],
            properties: {
                _id: {
                    bsonType: "int",
                    minimum: 1,
                    description: "must be an integer greater than 0 and is required"
                },
                name: {
                    bsonType: "string",
                    minLength: 2,
                    maxLength: 50,
                    description: "must be a string between 2 and 50 characters and is required"
                },
                price: {
                    bsonType: "double",
                    minimum: 0,
                    description: "must be a positive double and is required"
                },
                category: {
                    enum: ["Toys", "Home & Kitchen", "Books", "Electronics", "Clothing"],
                    description: "must be one of the specified categories and is required"
                },
                attributes: {
                    bsonType: "object",
                    properties: {
                        material: {
                            enum: ["Ceramic", "Stainless Steel", "Wood", "Wool", "Cotton"],
                            description: "must be one of the specified materials if present"
                        },
                        weight: {
                            bsonType: "string",
                            pattern: "^\\d+(\\.\\d+)?\\s*kg$",
                            description: "must be a string in format '#.# kg' if present"
                        },
                        size: {
                            enum: ["S", "M", "L", "XL"],
                            description: "must be a valid size if present"
                        },
                        color: {
                            bsonType: "string",
                            description: "must be a string if present"
                        },
                        brand: {
                            bsonType: "string",
                            description: "must be a string if present"
                        },
                        warranty: {
                            bsonType: "string",
                            pattern: "^\\d+\\s*years?$",
                            description: "must be in format '# year(s)' if present"
                        },
                        voltage: {
                            enum: ["110V", "220V"],
                            description: "must be a valid voltage if present"
                        }
                    },
                    additionalProperties: false,
                    description: "optional attributes object with specific fields"
                },
                last_updated: {
                    bsonType: "string",
                    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{6}$",
                    description: "must be an ISO date string and is required"
                }
            },
            additionalProperties: false
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

// Validator for orders collection
db.runCommand({
    collMod: "orders",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "user_id", "items", "total", "status", "order_date", "shipping_address"],
        properties: {
          _id: {
            bsonType: "number",
            minimum: 1,
            description: "must be a number greater than 0"
          },
          user_id: {
            bsonType: "number",
            minimum: 1,
            description: "must be a number greater than 0"
          },
          items: {
            bsonType: "array",
            minItems: 1,
            required: ["product_id", "quantity", "price"],
            items: {
              bsonType: "object",
              required: ["product_id", "quantity", "price"],
              properties: {
                product_id: {
                  bsonType: "number",
                  minimum: 1,
                  description: "must be a number greater than 0"
                },
                quantity: {
                  bsonType: "number",
                  minimum: 1,
                  description: "must be a number greater than 0"
                },
                price: {
                  bsonType: "number",
                  minimum: 0,
                  description: "must be a number greater than or equal to 0"
                }
              }
            },
            description: "must be an array with at least one item"
          },
          total: {
            bsonType: "number",
            minimum: 0,
            description: "must be a number greater than or equal to 0"
          },
          status: {
            bsonType: "string",
            enum: ["pending", "delivered", "cancelled", "shipped"],
            description: "must be one of: pending, delivered, cancelled, shipped"
          },
          order_date: {
            bsonType: "string",
            pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{6}$",
            description: "must be an ISO date string (e.g., 2025-03-23T12:34:56.789123)"
          },
          shipping_address: {
            bsonType: "object",
            required: ["street", "city", "state", "zipcode", "country"],
            properties: {
              street: {
                bsonType: "string",
                minLength: 1,
                description: "must be a non-empty string"
              },
              city: {
                bsonType: "string",
                minLength: 1,
                description: "must be a non-empty string"
              },
              state: {
                bsonType: "string",
                minLength: 2,
                maxLength: 2,
                description: "must be a 2-character string"
              },
              zipcode: {
                bsonType: "string",
                pattern: "^\\d{5}$",
                description: "must be a 5-digit string"
              },
              country: {
                bsonType: "string",
                minLength: 1,
                description: "must be a non-empty string"
              }
            },
            description: "must be an object with all required address fields"
          }
        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
});