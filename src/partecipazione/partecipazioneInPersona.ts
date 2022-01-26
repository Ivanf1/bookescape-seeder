import { Prisma } from "@prisma/client";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";
import inPersonEvent from "../event/inPerson";
import user from "../user/user";

const makePartecipazione = (
  eventId: number,
  userId: number
): Prisma.partecipazione_in_personaCreateInput => {
  return {
    evento_in_persona: {
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

const addPartecipazione = async (partecipazione: Prisma.partecipazione_in_personaCreateInput) => {
  await prisma.partecipazione_in_persona.create({ data: partecipazione });
};

const seedPartecipazione = async () => {
  console.log("Partecipazione In Persona: seeding start");
  const userIds = await user.getIds();
  const eventIds = await inPersonEvent.getIds();

  // for every event associate a random number of user
  for (let i = 0; i < eventIds.length; i++) {
    const randomNumOfPartecipazione = getRandomInt(1, userIds.length - 1);
    // make a copy of the array
    let userIdsSupport = userIds.slice();
    for (let j = 0; j < randomNumOfPartecipazione; j++) {
      const randomIdx = getRandomInt(0, userIdsSupport.length - 1);
      const partecipazione = makePartecipazione(eventIds[i], userIdsSupport[randomIdx]);
      userIdsSupport.splice(randomIdx, 1);
      await addPartecipazione(partecipazione);
    }
  }

  console.log("Partecipazione In Persona: seeding done");
};

export default {
  makePartecipazione,
  addPartecipazione,
  seedPartecipazione,
};
