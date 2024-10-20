const { spawn } = require("child_process");
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
  try {
    // Spawn Python process to generate test file
    const pyProcess = spawn("python", [
      path.join(__dirname, "../py-scripts", "test_to_json.py"),
      // path.join(__dirname, "../py-scripts", "test_generator.py"),
      questions, // 1st arg - user's input
      filepath, // 2nd arg - file to write to
    ]);

    // Handle Python script 'print' output
    pyProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    // Handle Python script error
    pyProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        // Handle Python script error
        return res.status(500).json({ message: "Error generating test file." });
      }

      // Successfully generated file, send response
      return res.status(200).json({
        message: "Test generated successfully.",
        downloadLink: `/tests/${filename}`,
      });
    });
  } catch (error) {
    // Catch any other unexpected errors
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
