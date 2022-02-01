import { Prisma } from "@prisma/client";
import prisma from "../../db/db";
import getRandomInt from "../../utils/randomInt";
import virtualEvent from "../event/virtual";
import user from "../user/user";

const makePartecipazione = (
  eventId: number,
  userId: number
): Prisma.partecipazione_virtualeCreateInput => {
  return {
    evento_virtuale: {
      connect: {
        id: eventId,
      },
    },
    utente: {
      connect: {
        id: userId,
      },
    },
  };
};

const addPartecipazione = async (partecipazione: Prisma.partecipazione_virtualeCreateInput) => {
  await prisma.partecipazione_virtuale.create({ data: partecipazione });
};

const seedPartecipazione = async () => {
  console.log("Partecipazione Virtuale: seeding start");
  const userIds = await user.getIds();
  const eventIds = await virtualEvent.getIds();

  // for every event associate a random number of user
  for (let i = 0; i < eventIds.length; i++) {
    const randomNumOfPartecipazione = getRandomInt(1, userIds.length - 3);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfPartecipazione; j++) {
      // make user 1 and 2 have no partecipazione
      const randomIdx = getRandomInt(2, userIdsSupport.length - 1);
      const partecipazione = makePartecipazione(eventIds[i], userIdsSupport[randomIdx]);
      userIdsSupport.splice(randomIdx, 1);
      await addPartecipazione(partecipazione);
    }
  }

  console.log("Partecipazione Virtuale: seeding done");
};

export default {
  makePartecipazione,
  addPartecipazione,
  seedPartecipazione,
};
