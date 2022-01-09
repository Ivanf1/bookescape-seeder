import prisma from "../db/db";

/**
 * Add a publisher to db. Only makes the insertion
 * if the publisher is not already present
 *
 * @param name: publisher's name
 * @returns the publisher id if was already present or
 * successfully inserted in db, null otherwise
 */
const addPublisher = async (name: string): Promise<number | null> => {
  const existingPublisher = await prisma.editore.findUnique({ where: { nome: name } });

  if (existingPublisher) return existingPublisher.id;

  await prisma.editore.create({
    data: {
      nome: name,
    },
  });

  const insertedPublisher = await prisma.editore.findUnique({ where: { nome: name } });

  if (insertedPublisher) return insertedPublisher.id;

  return null;
};

export default {
  addPublisher,
};
