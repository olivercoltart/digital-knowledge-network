// import express from "express";
// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";
// import { signupSchema } from "../validation/auth.validation.js"; // corrected relative path

// const router = express.Router();
// const prisma = new PrismaClient();

// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password } = signupSchema.parse(req.body);

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (existingUser) return res.status(409).json({ message: "Email already in use" });

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await prisma.user.create({
//       data: { email, password: hashedPassword, role: "CONSULTANT" },
//     });

//     res.status(201).json({ id: user.id, email: user.email, role: user.role });
//   } catch (error) {
//     res.status(400).json({ message: "Invalid signup data" });
//   }
// });

// export default router;

const express = require("express");
const router = express.Router();
const prisma = require('../prisma/client');

router.post("/test", (req, res) => {
  res.status(200).json({
    message: "Auth route working",
    body: req.body,
  });
});

module.exports = router;
