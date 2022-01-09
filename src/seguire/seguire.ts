import { Prisma } from "@prisma/client";
import user from "../user/user";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";

const makeSeguire = (
  userSegueId: number,
  userSeguitoId: number
): Prisma.seguireUncheckedCreateInput => {
  return {
    id_utente_segue: userSegueId,
    id_utente_seguito: userSeguitoId,
  };
};

const addSeguire = async (seguire: Prisma.seguireUncheckedCreateInput) => {
  await prisma.seguire.create({ data: seguire });
};

const seedSeguire = async () => {
  console.log("Seguire: seeding seguire");
  const userIds = await user.getIds();

  const randomUserStop = getRandomInt(userIds.length / 2, userIds.length);
  // make a random number of seguire for a random num of utente
  for (let i = 0; i < randomUserStop; i++) {
    const randomNumOfSeguire = getRandomInt(1, userIds.length / 2);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfSeguire; j++) {
      // randomly connect a user with another user
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const seguire = makeSeguire(userIdsSupport[randomIdx], userIds[i]);
      userIdsSupport.splice(randomIdx, 1);
      await addSeguire(seguire);
    }
  }

  console.log("Seguire: seeding done");
};

export default {
  makeSeguire,
  addSeguire,
  seedSeguire,
};
