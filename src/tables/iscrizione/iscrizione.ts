import { Prisma } from "@prisma/client";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";
import user from "../user/user";
import bookClub from "../bookClub/bookClub";

const makeIscrizione = (clubId: number, userId: number): Prisma.iscrizioneUncheckedCreateInput => {
  return {
    id_utente: userId,
    id_club: clubId,
  };
};

const addIscrizione = async (iscrizione: Prisma.iscrizioneUncheckedCreateInput) => {
  await prisma.iscrizione.create({ data: iscrizione });
};

const seedIscrizione = async () => {
  console.log("Iscrizione: seeding start");
  const userIds = await user.getIds();
  const clubIds = await bookClub.getIds();

  // for every club associate a random number of user
  for (let i = 0; i < clubIds.length; i++) {
    const randomNumOfIscrizione = getRandomInt(1, userIds.length - 3);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfIscrizione; j++) {
      // make user 1 and 2 have no iscrizione
      const randomIdx = getRandomInt(2, userIdsSupport.length - 1);
      const iscrizione = makeIscrizione(clubIds[i], userIdsSupport[randomIdx]);
      userIdsSupport.splice(randomIdx, 1);
      await addIscrizione(iscrizione);
    }

    await prisma.club_libro.update({
      data: {
        numero_iscritti: randomNumOfIscrizione,
      },
      where: {
        id: clubIds[i],
      },
    });
  }

  console.log("Iscrizione: seeding done");
};

export default {
  makeIscrizione,
  addIscrizione,
  seedIscrizione,
};
