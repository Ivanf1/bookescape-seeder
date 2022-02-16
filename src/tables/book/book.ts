import prisma from "../../db/db";
import puppeteer from "puppeteer";
import mapAuthorNameToNameSurname from "../../utils/authorName";
import Author from "../author/author";
import Publisher from "../publisher/publisher";
import Genre from "../genre/genre";
import getBookImagePath from "../../utils/bookImagePath";
import load from "../../loader/loader";
import { writeJson, readJson } from "../../loader/bookLoader";

interface Book {
  isbn13: string;
  titolo: string;
  descrizione: string;
  dataPpub: Date;
  img: string;
  publisher: string;
  authorName: string;
  authorSurname: string;
  genre: string;
  publisherId: number;
  authorId: number;
  genreId: number;
}

const addBookWithConnections = async (book: Book) => {
  await Author.addAuthor(book.authorName, book.authorSurname);
  await Genre.addGenre(book.genre);
  await Publisher.addPublisher(book.publisher);
  await addBook(book);
};

const addBook = async (book: Book) => {
  await prisma.libro.create({
    data: {
      isbn_13: book.isbn13,
      titolo: book.titolo,
      descrizione: book.descrizione,
      data_pub: book.dataPpub,
      img: book.img,
      id_editore: book.publisherId,
      appartenenza: { create: { id_genere: book.genreId } },
      composizione: { create: { id_autore: book.authorId } },
    },
  });
};

const storeBook = async (url: string, page: puppeteer.Page): Promise<Book | null> => {
  console.log(`getting: ${url}`);
  const data = await getBook(url, page);

  const [name, surname] = mapAuthorNameToNameSurname(data.author);

  const splitDate = data.data.split("/");
  const validDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);

  let authorId = await Author.addAuthor(name.trim(), surname.trim());
  let genreId = await Genre.addGenre(data.genre.trim());
  let publisherId = await Publisher.addPublisher(data.editor.trim());
  if (!publisherId || !authorId || !genreId) return null;

  console.log(`inserting: ${url}`);

  const img = getBookImagePath(data.img.trim());

  const book: Book = {
    isbn13: data.isbn13.trim(),
    titolo: data.bookTitle.trim(),
    descrizione: data.description.trim(),
    dataPpub: validDate,
    img: img.trim(),
    authorName: name.trim(),
    authorSurname: surname.trim(),
    publisher: data.editor.trim(),
    genre: data.genre.trim(),
    publisherId: publisherId,
    authorId: authorId,
    genreId: genreId,
  };

  addBook(book);

  return book;
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

const scrapeBooks = async (fileName: string): Promise<Book[]> => {
  const urls = load(fileName);
  console.log("Book: Puppeteer: starting browser");
  const browser = await puppeteer.launch();
  console.log("Book: Puppeteer: browser started");
  console.log("Book: Puppeteer: creating page");
  const page = await browser.newPage();
  console.log("Book: Puppeteer: page created");

  const books: Book[] = [];
  for (let i = 0; i < urls.length; i++) {
    console.log(`book n. ${i + 1}`);
    const b = await storeBook(urls[i], page);
    if (b) books.push(b);
  }

  await page.close();
  console.log("Book: Puppeteer: page closed");
  await browser.close();
  console.log("Book: Puppeteer: browser closed");

  return books;
};

const persistBooks = async (books: Book[]) => {
  for (let book of books) {
    await addBookWithConnections(book);
  }
};

const seedBooks = async (fileWithUrls: string, fileNameForJsonWrite: string) => {
  console.log("Book: seeding start");
  let data = <Book[]>readJson(fileNameForJsonWrite);
  if (!data) {
    console.log("Book: no file with books found");
    console.log("Book: scraping start");
    const books = await scrapeBooks(fileWithUrls);
    console.log("Book: scraping end");
    console.log("Book: writing file with books start");
    writeJson(fileNameForJsonWrite, books);
    console.log("Book: writing file with books done");
  } else {
    console.log("Book: file with books found");
    console.log("Book: seeding from file");
    await persistBooks(data);
  }
  console.log("Book: seeding done");
};

export default {
  getIds,
  seedBooks,
  addBook,
};
