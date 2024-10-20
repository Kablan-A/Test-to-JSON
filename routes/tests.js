// routes/tests.js
const express = require("express");
const fs = require("fs");
const db = require("../db"); // Your PostgreSQL connection pool
const { parseQnAs } = require("../util");

const router = express.Router();
const path = require("path");

// Set up a route to serve all generated tests
router.get("/", (req, res) => {
  const TESTS_DIR = path.join(__dirname, "../generated-tests");
  if (!fs.existsSync(TESTS_DIR)) {
    return res.status(404).json({ message: "No tests found" });
  }

  // Read the directory to get all test files
  fs.readdir(TESTS_DIR, (err, files) => {
    if (err) {
      console.error("Error reading the test directory:", err);
      return res.status(500).json({ message: "Error reading tests directory" });
    }

    // Filter the list to only include `.txt` files and map to the desired format
    const tests = files
      .filter((file) => file.endsWith(".txt")) // Only keep .txt files
      .map((file) => ({
        name: path.basename(file, ".txt"), // Remove the .txt extension for the name
        downloadLink: `/tests/${path.basename(file)}`, // Set download link
      }));

    // Respond with the list of tests
    res.status(200).json(tests);
  });
});

// Set up a route to serve the generated test file
router.get("/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../generated-tests",
    req.params.filename
  );
  console.log(filePath);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).send("File not found.");
    return;
  }

  // Send the file as a downloadable attachment
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("File download error.");
    }
  });
});

// Endpoint to handle form submission
router.post("/", async (req, res) => {
  const { testName, questions } = req.body;

  // Validation: Check if both testName and questions are provided
  if (!testName || !questions) {
    return res
      .status(400)
      .json({ message: "Test name and questions are required." });
  }

  const parsedQuestions = parseQnAs(questions);
  console.log("parsedQuestions: ", parsedQuestions);
  try {
    // Begin transaction to insert all test questions
    await db.query("BEGIN");

    // Insert each question into the tests table
    for (const questionObj of parsedQuestions) {
      const { question, instruction, correct_answer, all_answers } =
        questionObj;

      const query = `
        INSERT INTO tests (test_name, question, instruction, correct_answer, all_answers)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const values = [
        testName,
        question,
        instruction,
        correct_answer,
        all_answers,
      ];

      await db.query(query, values); // Insert into PostgreSQL
    }

    // Commit the transaction
    await db.query("COMMIT");

    // Send success response
    res.status(201).json({ message: "Test submitted successfully." });
  } catch (error) {
    // Rollback transaction if any error occurs
    await db.query("ROLLBACK");
    console.error("Error inserting test:", error);
    res
      .status(500)
      .json({ message: "Failed to submit test. Please try again later." });
  }
});

// export the router module so that server.js file can use it
module.exports = router;
