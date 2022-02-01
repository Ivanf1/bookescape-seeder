import { Prisma } from "@prisma/client";
import book from "../book/book";
import user from "../user/user";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";

const makeSegnare = (userId: number, bookIsbn: string): Prisma.segnareCreateInput => {
  const stato = getRandomInt(0, 2);

  return {
    libro: {
      connect: {
        isbn_13: bookIsbn,
      },
    },
    utente: {
      connect: {
        id: userId,
      },
    },
    stato,
    // stato = 0 -> book read
    // if user has not read book, no vote can be assigned
    voto: stato == 0 ? getRandomInt(1, 5) : null,
  };
};

const addSegnare = async (segnare: Prisma.segnareCreateInput): Promise<number> => {
  await prisma.segnare.create({ data: segnare });
  return segnare.voto ? segnare.voto : 0;
};

const seedSegnare = async () => {
  console.log("Segnare: seeding start");
  const bookIsbn = await book.getIds();
  const userIds = await user.getIds();

  const randomBookStop = getRandomInt(bookIsbn.length / 2, bookIsbn.length);
  // make a random number of segnare for a random num of book
  for (let i = 0; i < randomBookStop; i++) {
    const randomNumOfVotazione = getRandomInt(1, userIds.length / 2);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    let sumVotazioni = 0;
    for (let j = 0; j < randomNumOfVotazione; j++) {
      // randomly connect a user with a book
      // make user 1 and 2 have no segnare
      const randomIdx = getRandomInt(2, userIdsSupport.length - 1);
      const segnare = makeSegnare(userIdsSupport[randomIdx], bookIsbn[i]);
      userIdsSupport.splice(randomIdx, 1);
      sumVotazioni += await addSegnare(segnare);
    }

    // update libro stats
    await prisma.libro.update({
      data: { totale_voti: sumVotazioni, numero_voti: randomNumOfVotazione },
      where: { isbn_13: bookIsbn[i] },
    });
  }

  console.log("Segnare: seeding done");
};

export default {
  makeSegnare,
  addSegnare,
  seedSegnare,
};
