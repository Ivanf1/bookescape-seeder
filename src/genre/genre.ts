import prisma from "../db/db";

/**
 * Add a genre to db. Only makes the insertion
 * if the genre is not already present
 *
 * @param name: genre's name
 * @returns the genre id if was already present or
 * successfully inserted in db, null otherwise
 */
const addGenre = async (name: string): Promise<number | null> => {
  const existingGenre = await prisma.genere.findUnique({ where: { nome: name } });

  if (existingGenre) return existingGenre.id;

  await prisma.genere.create({
    data: {
      nome: name,
    },
  });

  const insertedGenre = await prisma.genere.findUnique({ where: { nome: name } });

  if (insertedGenre) return insertedGenre.id;

  return null;
};

export default {
  addGenre,
};
