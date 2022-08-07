import request from "supertest";
import app from "../../../src/app.js";

describe("Test fetch endpoints", () => {
	test("GET: /fetch redirects to /fetch/list", () => {
		return request(app)
			.get("/fetch")
			.expect(301)
			.expect("location", "/fetch/list");
	});
	test("GET: /fetch/list returns object with list of manga providers", () => {
		return request(app)
			.get("/fetch/list")
			.expect(200, {
				statusCode: 200,
				statusText: "OK",
				data: ["alpha", "asura", "flame", "luminous", "realm"],
			});
	});
});
