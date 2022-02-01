import { Prisma } from "@prisma/client";
import book from "../book/book";
import user from "../user/user";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";

const commentoTesto = [
  "Questo libro mi è piaciuto molto, lo consiglio",
  "Non mi è piaciuto",
  "Davvero bello",
  "Molto interessante",
  "Un classico",
];

const makeCommento = (userId: number, bookIsbn: string): Prisma.commentoCreateInput => {
  const testo = commentoTesto[getRandomInt(0, commentoTesto.length - 1)];

  const day = getRandomInt(1, 26);
  const month = getRandomInt(0, 11);
  const year = getRandomInt(2000, 2016);
  const hours = getRandomInt(0, 23);
  const minutes = getRandomInt(0, 59);
  const seconds = getRandomInt(0, 59);

  const date = new Date(year, month, day, hours, minutes, seconds);

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
    data_pub: date,
    testo,
  };
};

const addCommento = async (commento: Prisma.commentoCreateInput) => {
  await prisma.commento.create({ data: commento });
};

const seedCommento = async () => {
  console.log("Commento: seeding start");
  const bookIsbn = await book.getIds();
  const userIds = await user.getIds();

  const randomBookStop = getRandomInt(bookIsbn.length / 2, bookIsbn.length);
  // make a random number of commento for a random num of book
  for (let i = 0; i < randomBookStop; i++) {
    const randomNumOfCommento = getRandomInt(1, userIds.length / 2);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfCommento; j++) {
      // randomly connect a user with a book
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const commento = makeCommento(userIdsSupport[randomIdx], bookIsbn[i]);
      userIdsSupport.splice(randomIdx, 1);
      await addCommento(commento);
    }
  }

  // make one user comment on all books
  const randomUser = userIds[getRandomInt(0, userIds.length)];
  for (let i = 0; i < bookIsbn.length; i++) {
    const commento = makeCommento(randomUser, bookIsbn[i]);
    await addCommento(commento);
  }

  console.log("Commento: seeding done");
};

export default {
  makeCommento,
  addCommento,
  seedCommento,
};
