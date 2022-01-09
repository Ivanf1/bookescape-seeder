import prisma from "../db/db";
import puppeteer from "puppeteer";
import mapAuthorNameToNameSurname from "../utils/authorName";
import Author from "../author/author";
import Publisher from "../publisher/publisher";
import Genre from "../genre/genre";
import getBookImagePath from "../utils/bookImagePath";
import loadUrls from "../loaders/urlLoader";

const addBook = async (
  isbn13: string,
  titolo: string,
  descrizione: string,
  dataPpub: Date,
  img: string,
  publisherId: number,
  authorId: number,
  genreId: number
) => {
  await prisma.libro.create({
    data: {
      isbn_13: isbn13,
      titolo: titolo,
      descrizione: descrizione,
      data_pub: dataPpub,
      img: img,
      appartenenza: { create: { id_genere: genreId } },
      composizione: { create: { id_autore: authorId } },
      pubblicazione: { create: { id_editore: publisherId } },
    },
  });
};

const storeBook = async (url: string, page: puppeteer.Page) => {
  console.log(`getting: ${url}`);
  const data = await getBook(url, page);

  const [name, surname] = mapAuthorNameToNameSurname(data.author);

  const splitDate = data.data.split("/");
  const validDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);

  let authorId = await Author.addAuthor(name.trim(), surname.trim());
  let genreId = await Genre.addGenre(data.genre.trim());
  let publisherId = await Publisher.addPublisher(data.editor.trim());
  if (!publisherId || !authorId || !genreId) return;

  console.log(`inserting: ${url}`);

  const img = getBookImagePath(data.img.trim());

  addBook(
    data.isbn13.trim(),
    data.bookTitle.trim(),
    data.description.trim(),
    validDate,
    img.trim(),
    publisherId,
    authorId,
    genreId
  );
};

const getBook = async (url: string, page: puppeteer.Page) => {
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector("div .intestation > p > a.nti-author");
  const authorHandle = await page.$("div .intestation > p > a.nti-author");
  const author = await page.evaluate((el) => el.textContent, authorHandle);

  await page.waitForSelector("div .intestation > p > a.nti-editor");
  const editorHandle = await page.$("div .intestation > p > a.nti-editor");
  const editor = await page.evaluate((el) => el.textContent, editorHandle);

  await page.waitForSelector("div .product-details > p > span.value > a.gen");
  const genreHandle = await page.$("div .product-details > p > span.value > a.gen");
  const genre = await page.evaluate((el) => el.textContent, genreHandle);

  await page.waitForSelector("div .intestation > h1");
  const bookTitleHandle = await page.$("div .intestation > h1");
  const bookTitle = await page.evaluate((el) => el.textContent, bookTitleHandle);

  await page.waitForSelector("div .product-descriptions > p");
  const descriptionHandle = await page.$("div .product-descriptions > p");
  const description = await page.evaluate((el) => el.textContent, descriptionHandle);

  await page.waitForSelector("div .product-details > p > span.value > span.detail");
  const dataHandle = await page.$$("div .product-details > p > span.value > span.detail");
  let data;
  let isbn13;
  for (const a of dataHandle) {
    let d = await a.evaluate((el) => el.textContent);
    if (/[0-9]+\/[0-9]+\/[0-9]+/.test(d)) data = d;
    if (/[0-9]{13}/.test(d)) isbn13 = d;
  }

  await page.waitForSelector("div .product-images > a > img");
  const imgHandle = await page.$("div .product-images > a > img");
  const img = await page.evaluate((el) => el.src, imgHandle);

  return {
    bookTitle,
    author,
    editor,
    description,
    genre,
    data,
    isbn13,
    img,
  };
};

const getIds = async (): Promise<string[]> => {
  const res = await prisma.libro.findMany({ select: { isbn_13: true } });
  const ids = res.map((c) => c.isbn_13);
  return ids;
};

const seedBooks = async () => {
  const urls = loadUrls();
  console.log("Book: Puppeteer: starting browser");
  const browser = await puppeteer.launch();
  console.log("Book: Puppeteer: browser started");
  console.log("Book: Puppeteer: creating page");
  const page = await browser.newPage();
  console.log("Book: Puppeteer: page created");

  console.log("Book: seeding start");
  for (let i = 0; i < urls.length; i++) {
    console.log(`book n. ${i + 1}`);
    await storeBook(urls[i], page);
  }

  await page.close();
  console.log("Book: Puppeteer: page closed");
  await browser.close();
  console.log("Book: Puppeteer: browser closed");
  console.log("Book: seeding done");
};

export default {
  getIds,
  seedBooks,
  addBook,
};
