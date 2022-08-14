import { createEntry, createStatus } from "./create";
import { getEntry, getCollection } from "./read";
import { updateMangaEntry, updateChapterEntry, updateStatus } from "./update";

const db = {
	createEntry,
	createStatus,
	getEntry,
	getCollection,
	updateMangaEntry,
	updateChapterEntry,
	updateStatus,
};

export default db;
