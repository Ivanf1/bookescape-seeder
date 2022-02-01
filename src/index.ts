import BookClub from "./tables/bookClub/bookClub";
import VirtualEvent from "./tables/event/virtual";
import InPersonEvent from "./tables/event/inPerson";
import Library from "./tables/library/library";
import Segnare from "./tables/segnare/segnare";
import User from "./tables/user/user";
import Book from "./tables/book/book";
import Seguire from "./tables/seguire/seguire";
import TemaInPerson from "./tables/tema/temaInPersona";
import TemaVirtual from "./tables/tema/temaVirtuale";
import PartecipazioneVirtual from "./tables/partecipazione/partecipazioneVirtuale";
import PartecipazioneInPerson from "./tables/partecipazione/partecipazioneInPersona";
import Iscrizione from "./tables/iscrizione/iscrizione";
import Svolgimento from "./tables/svolgimento/svolgimento";
import Commento from "./tables/commento/commento";

const main = async () => {
  await Book.seedBooks("seed/urls", "seed/books");
  await User.seedUsers("seed/user_names", "seed/user_surnames");
  await BookClub.seedClubs("seed/book_club");
  await VirtualEvent.seedEvents();
  await InPersonEvent.seedEvents(); // this needs to happen before library
  await Library.seedLibraries("seed/library");
  await Segnare.seedSegnare();
  await Seguire.seedSeguire();
  await TemaInPerson.seedTema();
  await TemaVirtual.seedTema();
  await PartecipazioneVirtual.seedPartecipazione();
  await PartecipazioneInPerson.seedPartecipazione();
  await Iscrizione.seedIscrizione();
  await Svolgimento.seedSvolgimento();
  await Commento.seedCommento();
};

main();
