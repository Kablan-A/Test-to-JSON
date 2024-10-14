const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.json());

// Ensure the 'generated-tests' directory exists for storing files
const TESTS_DIR = path.join(__dirname, "generated-tests");
if (!fs.existsSync(TESTS_DIR)) {
  fs.mkdirSync(TESTS_DIR);
}

// 'import' test module from routes. it has endpoints for tests
// All endpoints start with '/tests'
const test = require(path.join(__dirname, "routes/test.js"));
app.use("/tests", test);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
