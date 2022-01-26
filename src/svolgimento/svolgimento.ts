import { Prisma } from "@prisma/client";
import inPersonEvent from "../event/inPerson";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";
import library from "../library/library";

const makeSvolgimento = (
  eventId: number,
  libraryId: number
): Prisma.svolgimentoUncheckedCreateInput => {
  return {
    id_evento: eventId,
    id_libreria: libraryId,
  };
};

const addSvolgimento = async (svolgimento: Prisma.svolgimentoUncheckedCreateInput) => {
  await prisma.svolgimento.create({ data: svolgimento });
};

const seedSvolgimento = async () => {
  console.log("Svolgimento: seeding start");
  const eventIds = await inPersonEvent.getEventIds();
  const libraryIds = await library.getIds();

  // make a svolgimento for every library
  for (let i = 0; i < libraryIds.length; i++) {
    const randomIdx = getRandomInt(0, eventIds.length - 1);
    const votazione = makeSvolgimento(eventIds[randomIdx], libraryIds[i]);
    eventIds.splice(randomIdx, 1);
    await addSvolgimento(votazione);
  }

  console.log("Svolgimento: seeding done");
};

export default {
  makeSvolgimento,
  addSvolgimento,
  seedSvolgimento,
};
