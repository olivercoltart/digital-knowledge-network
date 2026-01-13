const express = require("express");
const router = express.Router();
const resourceService = require("../services/resource.upload");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const prisma = require("../prisma/client");

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

// GET drafts for logged in user
router.get("/drafts", auth, async (req, res, next) => {
  try {
    const drafts = await prisma.document.findMany({
      where: { ownerId: req.user.id, status: "DRAFT" },
      orderBy: { createdAt: "desc" }
    });
    res.json(drafts);
  } catch (err) {
    next(err);
  }
});

// GET submitted resources for review (CHAMPION only)
router.get("/review", auth, requireRole("CHAMPION"), async (req, res, next) => {
  try {
    const items = await prisma.document.findMany({
      where: { status: "SUBMITTED" },
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// PATCH document status (CHAMPION only)
router.patch("/:id/status", auth, requireRole("CHAMPION"), async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
