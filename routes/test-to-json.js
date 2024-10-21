const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { parseQnAs } = require("../util/parseQnAs");

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
      .filter((file) => file.endsWith(".json")) // Only keep .txt files
      .map((file) => ({
        name: path.basename(file, ".json"), // Remove the .txt extension for the name
        downloadLink: `api/test-to-json/${path.basename(file)}`, // Set download link
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
  console.log(testName, questions);
  // Ensure input data is provided
  if (!testName || !questions) {
    return res
      .status(400)
      .json({ message: "Test name and questions are required" });
  }

  const filename = `${testName}.json`;
  const filepath = path.join(__dirname, "../generated-tests", filename);
  const parsedQuestions = parseQnAs(questions);
  try {
    // Writing the test content to the file
    fs.writeFile(filepath, JSON.stringify(parsedQuestions), "utf8", (err) => {
      if (err) {
        console.error("Error saving the test file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
    return res.send({
      message: "Test generated successfully.",
      downloadLink: `api/test-to-json/${filename}`,
    });
  } catch (error) {
    // Catch any other unexpected errors
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// export the router module so that server.js file can use it
module.exports = router;