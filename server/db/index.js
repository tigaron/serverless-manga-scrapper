import { createStatus, createEntry } from "./create";
import { getEntry, getMangaList, getChapterList, getStatus } from "./read";
import { updateEntry, updateChapter, updateContent, updateStatus } from "./update";

const db = {
	createStatus,
	createEntry,
	updateEntry,
	updateChapter,
	updateContent,
	getEntry,
	getMangaList,
	getChapterList,
	getStatus,
	updateStatus,
};

export default db;
