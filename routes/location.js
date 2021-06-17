var express = require("express");
var router = express.Router();
const Locations = require("../models/Locations");

/**
 * Gets autocomplete places results from Google
 * @name GET/api/location/autocomplete
 * @body {string} input
 * @returns { data:list<object> where object has string id and string name }
 */
router.get("/autocomplete/:input", async (req, res) => {
  if (req.params.input === undefined) {
    res.status(400).json({ error: "missing input to autocomplete request" });
  } else {
    let data = await Locations.getAutocompleteResults(req.params.input);
    res.status(200).json(data);
  }
});

module.exports = router;
