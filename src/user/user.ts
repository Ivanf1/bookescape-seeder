import getRandomInt from "../utils/randomInt";
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import prisma from "../db/db";
import load from "../loader/loader";

const emailDomains = ["gmail.com", "hotmail.it", "outlook.com", "proton.com"];

const makeUser = (name: string, surname: string): Prisma.utenteCreateInput => {
  const usernamePostfix = getRandomInt(1, 99);
  const username = `${name}${usernamePostfix}`;

  const emailDomainIndex = getRandomInt(0, emailDomains.length - 1);
  const email = `${username.toLowerCase()}@${emailDomains[emailDomainIndex]}`;

  const password = crypto.randomBytes(16).toString("base64");

  const day = getRandomInt(1, 26);
  const month = getRandomInt(0, 11);
  const year = getRandomInt(1980, 2016);

  const date = new Date(year, month, day);

  return {
    username,
    email,
    passwd: password,
    nome: name,
    cognome: surname,
    data_reg: date,
  };
};

const addUser = async (user: Prisma.utenteCreateInput) => {
  await prisma.utente.create({ data: user });
};

const getIds = async (): Promise<number[]> => {
  const res = await prisma.utente.findMany({ select: { id: true } });
  const ids = res.map((c) => c.id);
  return ids;
};

const seedUsers = async (fileNameNames: string, fileNameSurnames: string) => {
  const names = load(fileNameNames);
  const surnames = load(fileNameSurnames);

  console.log("User: seeding start");

  for (let i = 0; i < names.length; i++) {
    const user = makeUser(names[i], surnames[i]);
    await addUser(user);
  }

  console.log("User: seeding done");
};

export default {
  getIds,
  makeUser,
  seedUsers,
};
