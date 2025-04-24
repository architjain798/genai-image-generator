require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");


const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
const imageRoutes = require("./routes/imageRoutes");
app.use("/api", imageRoutes);

// Serve uploads for debugging (remove this in prod!)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger setup
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8")
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root
app.get("/", (req, res) => {
  res.send("Welcome to the OpenAI Image API! See /docs for Swagger UI");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server started: http://localhost:${port}`);
  console.log(`🔎 API docs:     http://localhost:${port}/docs`);
});
