import { Prisma } from "@prisma/client";
import event from "../event/event";
import prisma from "../db/db";
import loadLibraries from "../loaders/libraryLoader";

const makeLibrary = (address: string): Prisma.libreriaCreateInput => {
  const [citta, via, civico] = address.split(",");

  return {
    citta,
    via,
    civico: parseInt(civico),
  };
};

const addLibrary = async (library: Prisma.libreriaCreateInput) => {
  await prisma.libreria.create({ data: library });
};

const seedLibraries = async () => {
  const names = loadLibraries();
  const inPersonEventIds = await event.getInPersonEventIds();

  console.log("Library: seeding start");

  // Every library needs to be associated to an event in person
  // YOU NEED TO SEED EVENTS FIRST
  // we only create as many libraries as in person events
  for (let i = 0; i < inPersonEventIds.length; i++) {
    const library = makeLibrary(names[i]);
    await addLibrary(library);
  }

  console.log("Library: seeding done");
};

const getIds = async () => {
  const res = await prisma.libreria.findMany({ select: { id: true } });
  const ids = res.map((l) => l.id);
  return ids;
};

export default {
  makeLibrary,
  seedLibraries,
  getIds,
};
