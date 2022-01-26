import { Prisma } from "@prisma/client";
import book from "../book/book";
import user from "../user/user";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";

const makeDaLeggere = (userId: number, bookIsbn: string): Prisma.da_leggereUncheckedCreateInput => {
  return {
    id_libro: bookIsbn,
    id_utente: userId,
  };
};

const addDaLeggere = async (letto: Prisma.da_leggereUncheckedCreateInput) => {
  await prisma.da_leggere.create({ data: letto });
};

const seedDaLeggere = async () => {
  console.log("DaLeggere: seeding start");
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
      const letto = makeDaLeggere(userIdsSupport[randomIdx], bookIsbn[i]);
      userIdsSupport.splice(randomIdx, 1);
      await addDaLeggere(letto);
    }
  }

  console.log("DaLeggere: seeding done");
};

export default {
  makeDaLeggere,
  addDaLeggere,
  seedDaLeggere,
};
