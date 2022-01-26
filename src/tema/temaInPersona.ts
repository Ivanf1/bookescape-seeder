import { Prisma } from "@prisma/client";
import book from "../book/book";
import prisma from "../db/db";
import getRandomInt from "../utils/randomInt";
import inPersonEvent from "../event/inPerson";

const makeTema = (eventId: number, bookIsbn: string): Prisma.tema_in_personaCreateInput => {
  return {
    evento_in_persona: {
      connect: {
        id: eventId,
      },
    },
    libro: {
      connect: {
        isbn_13: bookIsbn,
      },
    },
  };
};

const addTema = async (letto: Prisma.tema_in_personaCreateInput) => {
  await prisma.tema_in_persona.create({ data: letto });
};

const seedTema = async () => {
  console.log("Tema In Persona: seeding start");
  const bookIsbn = await book.getIds();
  const eventIds = await inPersonEvent.getIds();

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

  console.log("Tema In Persona: seeding done");
};

export default {
  makeTema,
  addTema,
  seedTema,
};
