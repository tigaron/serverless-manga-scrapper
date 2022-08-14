import { createStatus, createEntry } from "./create.js";
import { getEntry } from "./read.js";
import { updateMangaEntry, updateChapterEntry, updateStatus } from "./update.js";

const db = {
	createStatus,
	createEntry,
	getEntry,
	updateMangaEntry,
	updateChapterEntry,
	updateStatus,
};

export default db;
