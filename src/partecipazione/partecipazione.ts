import { Prisma } from "@prisma/client";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";
import event from "../event/event";
import user from "../user/user";

const makePartecipazione = (
  eventId: number,
  userId: number
): Prisma.partecipazioneUncheckedCreateInput => {
  return {
    id_evento: eventId,
    id_utente: userId,
  };
};

const addPartecipazione = async (partecipazione: Prisma.partecipazioneUncheckedCreateInput) => {
  await prisma.partecipazione.create({ data: partecipazione });
};

const seedPartecipazione = async () => {
  console.log("Partecipazione: seeding start");
  const userIds = await user.getIds();
  const eventIds = await event.getIds();

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

  console.log("Partecipazione: seeding done");
};

export default {
  makePartecipazione,
  addPartecipazione,
  seedPartecipazione,
};
