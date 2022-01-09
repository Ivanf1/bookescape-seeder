import { Prisma } from "@prisma/client";
import getRandomInt from "../utils/randomInt";
import prisma from "../db/db";
import bookClub from "../bookClub/bookClub";

const platforms = ["Teams", "Zoom"];

const makeEvent = (eventNum: number, bookClubId: number): Prisma.eventoCreateInput => {
  const eventNumChar = String.fromCharCode(eventNum);

  const name = `Evento ${eventNumChar}`;
  const description = `Una lunga descrizione del bellissimo evento ${eventNumChar}`;

  const day = getRandomInt(1, 26);
  const month = getRandomInt(0, 11);
  const year = getRandomInt(2000, 2016);

  const startDate = new Date(year, month, day);
  const endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1));

  let event: Prisma.eventoCreateInput = {
    nome: name,
    descrizione: description,
    data_inizio: startDate,
    data_fine: endDate,
    club_libro: {
      connect: {
        id: bookClubId,
      },
    },
  };

  const isOnline = getRandomInt(0, 1);
  if (isOnline) {
    event = {
      ...event,
      piattaforma: platforms[getRandomInt(0, platforms.length - 1)],
      url_e: `event-${eventNumChar.toLowerCase()}-url`,
    };
  } else {
    event = {
      ...event,
      poster: `poster-for-event-${eventNumChar.toLowerCase()}`,
    };
  }

  return event;
};

const addEvent = async (event: Prisma.eventoCreateInput) => {
  await prisma.evento.create({ data: event });
};

const seedEvents = async () => {
  const halfBookClubsIds = await bookClub.getHalfIds();
  console.log("Event: seeding start");

  for (let i = 0; i < halfBookClubsIds.length; i++) {
    const event = makeEvent(i + 65, halfBookClubsIds[i]);
    await addEvent(event);
  }

  console.log("Event: seeding done");
};

const getIds = async (): Promise<number[]> => {
  const res = await prisma.evento.findMany({ select: { id: true } });
  const ids = res.map((c) => c.id);
  return ids;
};

const getInPersonEventIds = async () => {
  const res = await prisma.evento.findMany({ where: { AND: { piattaforma: null, url_e: null } } });
  const ids = res.map((e) => e.id);
  return ids;
};

export default {
  makeEvent,
  seedEvents,
  getIds,
  getInPersonEventIds,
};
