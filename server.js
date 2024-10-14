const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.json());

// Endpoint to handle form submission
app.post("/generate-test", async (req, res) => {
  console.log(req.body);
  try {
    const { testName, questions } = req.body;

    // Ensure input data is provided
    if (!testName || !questions) {
      console.log(testName, questions);
      return res
        .status(400)
        .json({ message: "Test name and questions are required" });
    }

    const filename = `${testName}.txt`;
    const filepath = path.join(__dirname, "tests", filename);

    // Spawn Python process to generate test file
    const pyProcess = spawn("python", [
      "test_generator.py",
      questions,
      filepath,
    ]);

    pyProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    pyProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pyProcess.on("close", (code) => {
      if (code === 0) {
        // Successfully generated file, send response
        return res.status(200).json({
          message: "Test generated successfully.",
          downloadLink: `/download-test/${filename}`,
        });
      } else {
        // Handle Python script error
        return res.status(500).json({ message: "Error generating test file." });
      }
    });
  } catch (error) {
    // Catch any other unexpected errors
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Set up a route to serve the generated test files
app.get("/download-test/:filename", (req, res) => {
  const filename = req.params.filename;
  console.log(filename);
  const filePath = path.join(__dirname, "tests", filename);
  console.log(filePath);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a downloadable attachment
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("File download error.");
      }
    });
  } else {
    res.status(404).send("File not found.");
  }
});

// Ensure the 'tests' directory exists for storing files
if (!fs.existsSync(path.join(__dirname, "tests"))) {
  fs.mkdirSync(path.join(__dirname, "tests"));
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
