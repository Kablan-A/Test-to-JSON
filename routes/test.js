// routes/users.js
const express = require("express");
const router = express.Router();

// Define a route
router.get("/", (req, res) => {
  res.send("this is test route"); // this gets executed when user visit http://localhost:3000/test
});

router.get("/1", (req, res) => {
  res.send("this is test 1 route"); // this gets executed when user visit http://localhost:3000/test/1
});

// export the router module so that server.js file can use it
module.exports = router;
