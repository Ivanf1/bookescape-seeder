import getRandomInt from "../utils/randomInt";
import loadBookClubNames from "../loaders/bookClubNameLoader";
import { Prisma } from "@prisma/client";
import prisma from "../db/db";

const makeClub = (name: string): Prisma.club_libroCreateInput => {
  const day = getRandomInt(1, 26);
  const month = getRandomInt(0, 11);
  const year = getRandomInt(1980, 2016);

  const date = new Date(year, month, day);

  return {
    nome: name,
    data_creazione: date,
    numero_iscritti: 0,
  };
};

const addClub = async (club: Prisma.club_libroCreateInput) => {
  await prisma.club_libro.create({ data: club });
};

const seedClubs = async () => {
  const names = loadBookClubNames();

  console.log("BookClub: seeding start");
  for (let i = 0; i < names.length; i++) {
    const club = makeClub(names[i]);
    await addClub(club);
  }
  console.log("BookClub: seeding done");
};

const getHalfIds = async (): Promise<number[]> => {
  const res = await prisma.club_libro.findMany({ select: { id: true } });
  const ids = res.map((c) => c.id);
  return ids.slice(0, ids.length / 2);
};

const getIds = async (): Promise<number[]> => {
  const res = await prisma.club_libro.findMany({ select: { id: true } });
  const ids = res.map((c) => c.id);
  return ids;
};

export default {
  getHalfIds,
  getIds,
  makeClub,
  seedClubs,
};
