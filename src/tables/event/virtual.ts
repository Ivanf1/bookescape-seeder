import { Prisma } from "@prisma/client";
import getRandomInt from "../../utils/randomInt";
import prisma from "../../db/db";
import bookClub from "../bookClub/bookClub";

const platforms = ["Teams", "Zoom"];

const makeEvent = (eventNum: number, bookClubId: number): Prisma.evento_virtualeCreateInput => {
  const eventNumChar = String.fromCharCode(eventNum);

  const name = `Evento V-${eventNumChar}`;
  const description = `Una lunga descrizione del bellissimo evento ${eventNumChar}`;

  const day = getRandomInt(1, 26);
  const month = getRandomInt(0, 11);
  const year = getRandomInt(2000, 2016);

  const startDate = new Date(year, month, day);
  const endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 1));

  let event: Prisma.evento_virtualeCreateInput = {
    nome: name,
    descrizione: description,
    data_inizio: startDate,
    data_fine: endDate,
    piattaforma: platforms[getRandomInt(0, platforms.length - 1)],
    url_e: `event-${eventNumChar.toLowerCase()}-url`,
    club_libro: {
      connect: {
        id: bookClubId,
      },
    },
  };

  return event;
};

const addEvent = async (event: Prisma.evento_virtualeCreateInput) => {
  await prisma.evento_virtuale.create({ data: event });
};

const seedEvents = async () => {
  const halfBookClubsIds = await bookClub.getHalfIds();
  console.log("Virtual Event: seeding start");

  for (let i = 0; i < halfBookClubsIds.length; i++) {
    const event = makeEvent(i + 65, halfBookClubsIds[i]);
    await addEvent(event);
  }

  console.log("Virtual Event: seeding done");
};

const getIds = async (): Promise<number[]> => {
  const res = await prisma.evento_virtuale.findMany({ select: { id: true } });
  const ids = res.map((c) => c.id);
  return ids;
};

const getEventIds = async () => {
  const res = await prisma.evento_virtuale.findMany();
  const ids = res.map((e) => e.id);
  return ids;
};

export default {
  makeEvent,
  seedEvents,
  getIds,
  getEventIds,
};
