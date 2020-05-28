var express = require("express");
const GeneratePathController = require("../controllers/GeneratePathController");

var router = express.Router();

router.post("/", GeneratePathController.generatePaths);

module.exports = router;