const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  createWebsite,
  getWebsites,
  getWebsiteById,
  updateWebsite,
  deleteWebsite,
} = require("../controllers/website.controller");

// Create a new website
router.post("/", auth, createWebsite);

// Get a list of websites
router.get("/", auth, getWebsites);

// Get a specific website
router.get("/:id", auth, getWebsiteById);

// Update a website
router.put("/:id", auth, updateWebsite);

// Delete a website
router.delete("/:id", auth, deleteWebsite);

module.exports = router;
