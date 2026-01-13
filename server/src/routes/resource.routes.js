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

// GET resource progress for logged in user
router.get("/progress", auth, async (req, res, next) => {
  try {
    const items = await prisma.document.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        verified: true,
        dataCompliant: true,
        approvals: {
          orderBy: { decidedAt: "desc" },
          take: 1,
          select: { feedback: true, decision: true, decidedAt: true }
        }
      }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET approved resources for search
router.get("/approved", auth, async (req, res, next) => {
  try {
    const items = await prisma.document.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET approved resources for audit (COUNCIL only)
router.get("/audit", auth, requireRole("COUNCIL"), async (req, res, next) => {
  try {
    const items = await prisma.document.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET approved resources for data compliance (DATA_OFFICER only)
router.get("/compliance", auth, requireRole("DATA_OFFICER"), async (req, res, next) => {
  try {
    const items = await prisma.document.findMany({
      where: { status: "APPROVED" },
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
    const { status, feedback } = req.body;
    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { status }
    });
    await prisma.approval.create({
      data: {
        decision: status,
        documentId: req.params.id,
        approverId: req.user.id,
        feedback: feedback || null
      }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH verify resource (COUNCIL only)
router.patch("/:id/verify", auth, requireRole("COUNCIL"), async (req, res, next) => {
  try {
    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { verified: true }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH mark resource data compliant (DATA_OFFICER only)
router.patch("/:id/compliant", auth, requireRole("DATA_OFFICER"), async (req, res, next) => {
  try {
    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { dataCompliant: true }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE resource (COUNCIL only)
router.delete("/:id", auth, requireRole("COUNCIL"), async (req, res, next) => {
  try {
    await prisma.approval.deleteMany({ where: { documentId: req.params.id } });
    await prisma.document.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
