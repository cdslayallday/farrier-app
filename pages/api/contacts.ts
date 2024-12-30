import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, phone, address, notes, horses } = req.body;

      // Validate payload
      if (!name || !phone || !address) {
        return res.status(400).json({ error: 'Missing required fields: name, phone, address' });
      }

      const newContact = await prisma.contact.create({
        data: {
          name,
          phone,
          address,
          notes,
          horses: Array.isArray(horses)
            ? {
                create: horses.map((horse) => ({
                  name: horse.name,
                  type: horse.type,
                  shoes: horse.shoes,
                })),
              }
            : undefined,
        },
      });

      return res.status(201).json(newContact);
    } catch (error) {
      console.error('[POST Error]', error);
      return res.status(500).json({ error: 'Failed to create contact' });
    }
  } else if (req.method === 'GET') {
    try {
      const contacts = await prisma.contact.findMany({
        include: { horses: true },
      });
      return res.status(200).json(contacts);
    } catch (error) {
      console.error('[GET Error]', error);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
