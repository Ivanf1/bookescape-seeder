import { Prisma } from "@prisma/client";
import book from "../book/book";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";
import event from "../event/event";

const makeTema = (eventId: number, bookIsbn: string): Prisma.temaUncheckedCreateInput => {
  return {
    id_libro: bookIsbn,
    id_evento: eventId,
  };
};

const addTema = async (letto: Prisma.temaUncheckedCreateInput) => {
  await prisma.tema.create({ data: letto });
};

const seedTema = async () => {
  console.log("Tema: seeding start");
  const bookIsbn = await book.getIds();
  const eventIds = await event.getIds();

  // for every event associate between 1 and 2 books
  for (let i = 0; i < eventIds.length; i++) {
    const randomNumOfTema = getRandomInt(1, 2);
    // make a copy of the array
    let bookIsbnSupport = bookIsbn.slice();
    for (let j = 0; j < randomNumOfTema; j++) {
      const randomIdx = getRandomInt(0, bookIsbnSupport.length - 1);
      const tema = makeTema(eventIds[i], bookIsbnSupport[randomIdx]);
      bookIsbnSupport.splice(randomIdx, 1);
      await addTema(tema);
    }
  }

  console.log("Tema: seeding done");
};

export default {
  makeTema,
  addTema,
  seedTema,
};
