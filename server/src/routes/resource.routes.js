const express = require("express");
const router = express.Router();
const resourceService = require("../services/resource.upload");
const auth = require("../middleware/auth");

// POST /api/resources
router.post("/", auth, async (req, res, next) => {
  try {
    const resource = await resourceService.createResource({
      ...req.body,
      ownerId: req.user.id
    });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
