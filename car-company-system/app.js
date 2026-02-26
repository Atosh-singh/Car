const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");  // 👈 ADD THIS

dotenv.config();

const app = express();

// DB connection
require("./config/db")();
require("./models");

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 🔥 ADD THESE 2 LINES
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Routes
const routes = require("./routes");
app.use(routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
  });
});

module.exports = app;