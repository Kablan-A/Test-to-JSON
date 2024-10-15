const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

// Ensure the 'generated-tests' directory exists for storing files
const GEN_TESTS_DIR = path.join(__dirname, "generated-tests");
if (!fs.existsSync(GEN_TESTS_DIR)) {
  fs.mkdirSync(GEN_TESTS_DIR);
}

// 'import' tests module from routes. it has endpoints for tests
// All endpoints start with '/tests'
const tests = require(path.join(__dirname, "routes/tests.js"));
app.use("/tests", tests);

// Middleware to parse form data
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res) => {
  res.status(404).send("<h1>404: This page doesn't exit</h1>");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
