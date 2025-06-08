const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");

const connectDB = require("../config/database");

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});

    console.log("Cleared existing data");

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@qrcafe.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();

    // Create staff user
    const staffUser = new User({
      username: "staff",
      email: "staff@qrcafe.com",
      password: "staff123",
      role: "staff",
    });
    await staffUser.save();

    console.log("Created users");

    // Create menu items
    const menuItems = [
      {
        name: "Classic Burger",
        description:
          "Juicy beef patty with lettuce, tomato, and our special sauce",
        price: 12.99,
        category: "main-course",
        image: "/images/burger.jpg",
        preparationTime: 15,
        ingredients: ["beef patty", "lettuce", "tomato", "cheese", "bun"],
        allergens: ["gluten", "dairy"],
      },
      {
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with parmesan cheese and croutons",
        price: 8.99,
        category: "appetizers",
        image: "/images/caesar-salad.jpg",
        preparationTime: 10,
        ingredients: [
          "romaine lettuce",
          "parmesan",
          "croutons",
          "caesar dressing",
        ],
        allergens: ["dairy", "gluten"],
      },
      {
        name: "Margherita Pizza",
        description:
          "Traditional pizza with tomato sauce, mozzarella, and fresh basil",
        price: 14.99,
        category: "main-course",
        image: "/images/pizza.jpg",
        preparationTime: 20,
        ingredients: ["pizza dough", "tomato sauce", "mozzarella", "basil"],
        allergens: ["gluten", "dairy"],
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake with chocolate frosting",
        price: 6.99,
        category: "desserts",
        image: "/images/chocolate-cake.jpg",
        preparationTime: 5,
        ingredients: ["chocolate", "flour", "eggs", "butter", "sugar"],
        allergens: ["gluten", "dairy", "eggs"],
      },
      {
        name: "Cappuccino",
        description: "Espresso with steamed milk and foam",
        price: 4.99,
        category: "beverages",
        image: "/images/cappuccino.jpg",
        preparationTime: 5,
        ingredients: ["espresso", "milk"],
        allergens: ["dairy"],
      },
      {
        name: "Fish & Chips",
        description: "Beer-battered fish with crispy fries",
        price: 16.99,
        category: "main-course",
        image: "/images/fish-chips.jpg",
        preparationTime: 18,
        ingredients: ["fish", "potatoes", "beer batter", "oil"],
        allergens: ["gluten", "fish"],
      },
      {
        name: "Greek Salad",
        description: "Fresh vegetables with feta cheese and olives",
        price: 9.99,
        category: "appetizers",
        image: "/images/greek-salad.jpg",
        preparationTime: 8,
        ingredients: ["tomatoes", "cucumber", "olives", "feta", "olive oil"],
        allergens: ["dairy"],
      },
      {
        name: "Iced Tea",
        description: "Refreshing iced tea with lemon",
        price: 2.99,
        category: "beverages",
        image: "/images/iced-tea.jpg",
        preparationTime: 3,
        ingredients: ["tea", "lemon", "ice"],
        allergens: [],
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee and mascarpone",
        price: 7.99,
        category: "desserts",
        image: "/images/tiramisu.jpg",
        preparationTime: 5,
        ingredients: ["ladyfingers", "coffee", "mascarpone", "cocoa"],
        allergens: ["gluten", "dairy", "eggs"],
      },
      {
        name: "Chef's Special Pasta",
        description: "Daily special pasta with seasonal ingredients",
        price: 18.99,
        category: "specials",
        image: "/images/special-pasta.jpg",
        preparationTime: 25,
        ingredients: ["pasta", "seasonal vegetables", "herbs", "cheese"],
        allergens: ["gluten", "dairy"],
      },
    ];

    await MenuItem.insertMany(menuItems);
    console.log("Created menu items");

    // Create tables
    const tables = [];
    for (let i = 1; i <= 12; i++) {
      tables.push({
        tableNumber: `T${i.toString().padStart(2, "0")}`,
        qrCode: `QR_TABLE_${i}`,
        capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
        status: "available",
      });
    }

    await Table.insertMany(tables);
    console.log("Created tables");

    console.log("Seed data created successfully!");
    console.log("Admin credentials: admin@qrcafe.com / admin123");
    console.log("Staff credentials: staff@qrcafe.com / staff123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
