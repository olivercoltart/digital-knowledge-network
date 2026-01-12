//  id        
//   title     
//   status    
//   ownerId   
//   owner     
//   createdAt
//   approvals
const prisma = require("../prisma/client");

async function createResource({ title, content, status, ownerId, createdAt }) {

  // Create user in DB
  const resource = await prisma.document.create({
    data: {
      title,
      content,
      status,
      ownerId,
      createdAt
    }
  });

  return resource;
}

module.exports = { createResource };