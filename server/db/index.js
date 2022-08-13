import { createStatus, createEntry } from "./create";
import { getEntry, getMangaListElement, getChapterListElement } from "./read";
import { updateMangaListElement, updateChapterListElement, updateStatus } from "./update";

const db = {
	createStatus,
	createEntry,
	getEntry,
	getMangaListElement,
	getChapterListElement,
	updateMangaListElement,
	updateChapterListElement,
	updateStatus,
};

export default db;
