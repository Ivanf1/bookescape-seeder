import { Prisma } from "@prisma/client";
import book from "../book/book";
import user from "../user/user";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";

const makeVotazione = (userId: number, bookIsbn: string): Prisma.votazioneUncheckedCreateInput => {
  const voto = getRandomInt(1, 5);

  return {
    id_libro: bookIsbn,
    id_utente: userId,
    voto,
  };
};

const addVotazione = async (votazione: Prisma.votazioneUncheckedCreateInput): Promise<number> => {
  await prisma.votazione.create({ data: votazione });
  return votazione.voto;
};

const seedVotazioni = async () => {
  console.log("Votazione: seeding start");
  const bookIsbn = await book.getIds();
  const userIds = await user.getIds();

  const randomBookStop = getRandomInt(bookIsbn.length / 2, bookIsbn.length);
  // make a random number of votazione for a random num of book
  for (let i = 0; i < randomBookStop; i++) {
    const randomNumOfVotazione = getRandomInt(1, userIds.length / 2);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    let sumVotazioni = 0;
    for (let j = 0; j < randomNumOfVotazione; j++) {
      // randomly connect a user with a book
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const votazione = makeVotazione(userIdsSupport[randomIdx], bookIsbn[i]);
      userIdsSupport.splice(randomIdx, 1);
      sumVotazioni += await addVotazione(votazione);
    }

    // update libro stats
    await prisma.libro.update({
      data: { totale_voti: sumVotazioni, numero_voti: randomNumOfVotazione },
      where: { isbn_13: bookIsbn[i] },
    });
  }

  console.log("Votazione: seeding done");
};

export default {
  makeVotazione,
  addVotazione,
  seedVotazioni,
};
