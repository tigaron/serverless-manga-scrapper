import { validateUUID, validateProvider, validateBody } from "../validations";
import { getMockReq, getMockRes } from "@jest-mock/express";

const { res, next, clearMockRes } = getMockRes();
beforeEach(() => {
	clearMockRes();
	jest.clearAllMocks();
});

describe("validateUUID behaviour", () => {
	test("Validation success --> call next()", () => {
		const req = getMockReq({ params: { id: "ac682d3d-83d7-4bb4-a81c-b2d61cf626b5" } });
		validateUUID(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("Validation fail --> return 400", () => {
		const req = getMockReq({ params: { id: "hello" } });
		validateUUID(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			status: 400,
			statusText: expect.any(String),
		});
	});
});

describe("validateProvider behaviour", () => {
	test("Validation success --> call next()", () => {
		const req = getMockReq({ params: { provider: "asura" } });
		validateProvider(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("Validation fail --> return 404", () => {
		const req = getMockReq({ params: { provider: "hello" } });
		validateProvider(req, res, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			status: 404,
			statusText: expect.any(String),
		});
	});
});

describe("validateBody behaviour", () => {
	test("Provider validation success --> call next()", () => {
		const items = "Provider";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { provider: "asura" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("Provider validation fail: not provided --> return 400", () => {
		const items = "Provider";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			status: 400,
			statusText: expect.any(String),
		});
	});

	test("Provider validation fail: invalid --> return 404", () => {
		const items = "Provider";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { provider: "hello" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			status: 404,
			statusText: expect.any(String),
		});
	});

	test("ProviderSlug validation success --> call next()", () => {
		const items = "ProviderSlug";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { provider: "asura", slug: "damn-reincarnation" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("ProviderSlug validation fail --> return 400", () => {
		const items = "ProviderSlug";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { provider: "asura" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			status: 400,
			statusText: expect.any(String),
		});
	});

	test("ProviderMangaSlug validation success --> call next()", () => {
		const items = "ProviderMangaSlug";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { provider: "asura", manga: "damn-reincarnation", slug: "damn-reincarnation-chapter-1" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("ProviderMangaSlug validation fail --> return 400", () => {
		const items = "ProviderMangaSlug";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { provider: "asura", slug: "damn-reincarnation-chapter-1" },
			is: () => req.headers["content-type"] === "application/json",
		});
		validateBody(items)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			status: 400,
			statusText: expect.any(String),
		});
	});

	test("Invalid header's content-type --> return 406", () => {
		const items = "Provider";
		const req = getMockReq();
		validateBody(items)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(406);
		expect(res.json).toHaveBeenCalledWith({
			status: 406,
			statusText: expect.any(String),
		});
	});
});
