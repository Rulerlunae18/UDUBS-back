const express = require("express");
const router = express.Router();
const seed = require("../../prisma/seed.js");

router.get("/", async (req, res) => {
  try {
    await seed();
    res.json({ ok: true, message: "Seed executed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
