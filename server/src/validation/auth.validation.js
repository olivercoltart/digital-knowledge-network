// import { z } from "zod";

// export const signupSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });
const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});