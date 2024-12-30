import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const contact = await prisma.contact.create({
    data: {
      name: 'John Doe',
      phone: '555-1234',
    },
  });

  console.log(contact);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

