import BookClub from "./bookClub/bookClub";
import VirtualEvent from "./event/virtual";
import InPersonEvent from "./event/inPerson";
import Library from "./library/library";
import Votazione from "./votazione/votazione";
import User from "./user/user";
import Book from "./book/book";
import Seguire from "./seguire/seguire";
import Letto from "./letto/letto";
import DaLeggere from "./daLeggere/daLeggere";
import TemaInPerson from "./tema/temaInPersona";
import TemaVirtual from "./tema/temaVirtuale";
import PartecipazioneVirtual from "./partecipazione/partecipazioneVirtuale";
import PartecipazioneInPerson from "./partecipazione/partecipazioneInPersona";
import Iscrizione from "./iscrizione/iscrizione";
import Svolgimento from "./svolgimento/svolgimento";

const main = async () => {
  await Book.seedBooks("seed/urls");
  await User.seedUsers("seed/user_names", "seed/user_surnames");
  await BookClub.seedClubs("seed/book_club");
  await VirtualEvent.seedEvents(); // this needs to happen before library
  await InPersonEvent.seedEvents(); // this needs to happen before library
  await Library.seedLibraries("seed/library");
  await Votazione.seedVotazioni();
  await Seguire.seedSeguire();
  await Letto.seedLetto();
  await DaLeggere.seedDaLeggere();
  await TemaInPerson.seedTema();
  await TemaVirtual.seedTema();
  await PartecipazioneVirtual.seedPartecipazione();
  await PartecipazioneInPerson.seedPartecipazione();
  await Iscrizione.seedIscrizione();
  await Svolgimento.seedSvolgimento();
};

main();
