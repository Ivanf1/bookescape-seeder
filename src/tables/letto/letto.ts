import { Prisma } from "@prisma/client";
import book from "../book/book";
import user from "../user/user";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";

const makeLetto = (userId: number, bookIsbn: string): Prisma.lettoUncheckedCreateInput => {
  return {
    id_libro: bookIsbn,
    id_utente: userId,
  };
};

const addLetto = async (letto: Prisma.lettoUncheckedCreateInput) => {
  await prisma.letto.create({ data: letto });
};

const seedLetto = async () => {
  console.log("Letto: seeding start");
  const bookIsbn = await book.getIds();
  const userIds = await user.getIds();

  const randomBookStop = getRandomInt(bookIsbn.length / 2, bookIsbn.length);
  // make a random number of votazione for a random num of book
  for (let i = 0; i < randomBookStop; i++) {
    const randomNumOfLetto = getRandomInt(1, userIds.length / 2);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfLetto; j++) {
      // randomly connect a user with a book
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const letto = makeLetto(userIdsSupport[randomIdx], bookIsbn[i]);
      userIdsSupport.splice(randomIdx, 1);
      await addLetto(letto);
    }
  }

  console.log("Letto: seeding done");
};

export default {
  makeLetto,
  addLetto,
  seedLetto,
};
