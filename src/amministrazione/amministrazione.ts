import { Prisma } from "@prisma/client";
import user from "../user/user";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";
import bookClub from "../bookClub/bookClub";

const makeAmministrazione = (
  userId: number,
  clubId: number
): Prisma.amministrazioneUncheckedCreateInput => {
  return {
    id_utente: userId,
    id_club: clubId,
  };
};

const addAmministrazione = async (amministrazione: Prisma.amministrazioneUncheckedCreateInput) => {
  await prisma.amministrazione.create({ data: amministrazione });
};

const seedAmministrazione = async () => {
  console.log("Amministrazione: seeding start");
  const clubIds = await bookClub.getIds();
  const userIds = await user.getIds();

  // const randomBookStop = getRandomInt(bookIsbn.length / 2, bookIsbn.length);
  // make a random number of amministrazione for every club
  for (let i = 0; i < clubIds.length; i++) {
    const randomNumOfAmministrazione = getRandomInt(1, 2);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfAmministrazione; j++) {
      // randomly connect a user with a club
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const votazione = makeAmministrazione(userIdsSupport[randomIdx], clubIds[i]);
      userIdsSupport.splice(randomIdx, 1);
      await addAmministrazione(votazione);
    }
  }

  console.log("Amministrazione: seeding done");
};

export default {
  makeAmministrazione,
  addAmministrazione,
  seedAmministrazione,
};
