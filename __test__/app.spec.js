import request from "supertest";
import app from "../src/app.js";

describe("Manga scraping API", () => {
	test("GET / --> hello message", async () => {
		const response = await request(app)
			.get("/")
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(expect.any(String));
	});
	test("GET /^scrape --> 404 if route does not exist", async () => {
		const response = await request(app).get("/hi").expect(404);
		expect(response.body).toEqual(
			expect.objectContaining({
				error: expect.any(String),
			})
		);
	});
	test("GET /scrape --> redirect to /scrape/list", async () => {
		await request(app)
			.get("/scrape")
			.expect("Location", "/scrape/list")
			.expect(301);
	});
	test("GET /scrape/list --> array of website source for scraping", async () => {
		const response = await request(app)
			.get("/scrape/list")
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				"Available list for scraping:": expect.arrayContaining([
					expect.any(String),
				]),
			})
		);
	});
	test("GET /scrape/list/:source --> array of manga list from source", async () => {
		const response = await request(app)
			.get("/scrape/list/flame")
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					title: expect.any(String),
					url: expect.any(String),
					slug: expect.any(String),
				}),
			])
		);
	});
	test("GET /scrape/list/:source --> 404 if not found", async () => {
		const response = await request(app).get("/scrape/list/reaper").expect(404);
		expect(response.body).toEqual(
			expect.objectContaining({
				error: expect.any(String),
			})
		);
	});
	test("GET /scrape/manga/:source/:slug --> specific manga details w/ array of chapter list", async () => {
		const response = await request(app)
			.get("/scrape/manga/luminous/mercenary-enrollment")
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				title: expect.any(String),
				cover: expect.any(String),
				synopsis: expect.any(String),
				chapters: expect.arrayContaining([
					expect.objectContaining({
						title: expect.any(String),
						url: expect.any(String),
						slug: expect.any(String),
					}),
				]),
			})
		);
	});
	test("GET /scrape/manga/:source/:slug --> 404 if not found", async () => {
		const response = await request(app)
			.get("/scrape/manga/flame/solo-levelling")
			.expect(404);
		expect(response.body).toEqual(
			expect.objectContaining({
				error: expect.any(String),
			})
		);
	});
	test("GET /scrape/chapter/:source/:slug --> specific chapter details w/ array of chapter content", async () => {
		const response = await request(app)
			.get("/scrape/chapter/asura/damn-reincarnation-chapter-20")
			.expect("Content-Type", /json/)
			.expect(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				title: expect.any(String),
				img: expect.arrayContaining([expect.any(String)]),
			})
		);
	});
	test("GET /scrape/chapter/:source/:slug --> 404 if not found", async () => {
		const response = await request(app)
			.get("/scrape/chapter/alpha/solo-levelling")
			.expect(404);
		expect(response.body).toEqual(
			expect.objectContaining({
				error: expect.any(String),
			})
		);
	});
});
