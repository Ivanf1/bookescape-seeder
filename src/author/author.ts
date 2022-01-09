import prisma from "../db/db";

/**
 * Add an author to db. Only makes the insertion
 * if the author is not already present
 * (We are not considering authors with the same name and surname)
 *
 * @param name: author's name
 * @param surname: author's surname
 * @returns the author id if was already present or
 * successfully inserted in db, null otherwise
 */
const addAuthor = async (name: string, surname: string): Promise<number | null> => {
  const existingAutore = await prisma.autore.findFirst({
    where: {
      AND: { nome: name, cognome: surname },
    },
  });

  if (existingAutore) return existingAutore.id;

  await prisma.autore.create({
    data: {
      nome: name,
      cognome: surname,
    },
  });

  const insertedAutore = await prisma.autore.findFirst({
    where: {
      AND: { nome: name, cognome: surname },
    },
  });

  if (insertedAutore) return insertedAutore.id;

  return null;
};

export default {
  addAuthor,
};
