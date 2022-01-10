import BookClub from "./bookClub/bookClub";
import Event from "./event/event";
import Library from "./library/library";
import Votazione from "./votazione/votazione";
import User from "./user/user";
import Book from "./book/book";
import Seguire from "./seguire/seguire";
import Letto from "./letto/letto";
import DaLeggere from "./daLeggere/daLeggere";
import Tema from "./tema/tema";
import Partecipazione from "./partecipazione/partecipazione";
import Iscrizione from "./iscrizione/iscrizione";
import Amministrazione from "./amministrazione/amministrazione";
import Svolgimento from "./svolgimento/svolgimento";

const main = async () => {
  await Book.seedBooks("seed/urls");
  await User.seedUsers("seed/user_names", "seed/user_surnames");
  await BookClub.seedClubs("seed/book_club");
  await Event.seedEvents(); // this needs to happen before library
  await Library.seedLibraries("seed/library");
  await Votazione.seedVotazioni();
  await Seguire.seedSeguire();
  await Letto.seedLetto();
  await DaLeggere.seedDaLeggere();
  await Tema.seedTema();
  await Partecipazione.seedPartecipazione();
  await Iscrizione.seedIscrizione();
  await Amministrazione.seedAmministrazione();
  await Svolgimento.seedSvolgimento();
};

main();
