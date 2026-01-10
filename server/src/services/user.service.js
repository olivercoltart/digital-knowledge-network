const prisma = require("../prisma/client");
const bcrypt = require('bcrypt');

async function createUser({ email, password, role }) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user in DB
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role
    }
  });

  return user;
}

module.exports = { createUser };