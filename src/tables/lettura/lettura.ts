import { Prisma } from "@prisma/client";
import book from "../book/book";
import user from "../user/user";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";

const makeLettura = (userId: number, bookIsbn: string): Prisma.letturaCreateInput => {
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

const addLettura = async (segnare: Prisma.letturaCreateInput): Promise<number> => {
  await prisma.lettura.create({ data: segnare });
  return segnare.voto ? segnare.voto : 0;
};

const seedLettura = async () => {
  console.log("Lettura: seeding start");
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
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const segnare = makeLettura(userIdsSupport[randomIdx], bookIsbn[i]);
      userIdsSupport.splice(randomIdx, 1);
      sumVotazioni += await addLettura(segnare);
    }

    // update libro stats
    await prisma.libro.update({
      data: { totale_voti: sumVotazioni, numero_voti: randomNumOfVotazione },
      where: { isbn_13: bookIsbn[i] },
    });
  }

  console.log("Lettura: seeding done");
};

export default {
  makeLettura,
  addLettura,
  seedLettura,
};
