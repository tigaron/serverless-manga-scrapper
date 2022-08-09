import { validateSource, validateBody } from "../../middlewares/validateRequest.js";
import { getMockReq, getMockRes } from "@jest-mock/express";

describe("Test validateSource validation middleware", () => {
	test("Validation success --> call next()", () => {
		const req = getMockReq({ params: { source: "asura" } });
		const { res, next } = getMockRes();
		validateSource(req, res, next);
		expect(next).toHaveBeenCalled();
	});
	test("Validation fail --> return 404", () => {
		const req = getMockReq({ params: { source: "ana" } });
		const { res, next } = getMockRes();
		validateSource(req, res, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({
			statusCode: 404,
			statusText: `Unknown source: '${req.params.source}'`,
		});
	});
});

describe("Test checkBody validation middleware", () => {
	test("Validation success --> call next()", () => {
		const type = "manga";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { source: "asura", slug: "manga+worthless-regression" },
			is: () => req.headers["content-type"] === "application/json",
		});
		const { res, next } = getMockRes();
		validateBody(type)(req, res, next);
		expect(next).toHaveBeenCalled();
	});
	test("Invalid header's content-type --> return 406", () => {
		const type = "list";
		const req = getMockReq();
		const { res, next } = getMockRes();
		validateBody(type)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(406);
		expect(res.json).toHaveBeenCalledWith({
			statusCode: 406,
			statusText: `Content is not acceptable`,
		});
	});
	test("Invalid body's source --> return 400", () => {
		const type = "list";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { source: "ana" },
			is: () => req.headers["content-type"] === "application/json",
		});
		const { res, next } = getMockRes();
		validateBody(type)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			statusCode: 400,
			statusText: `Unknown source: '${req.body.source}'`,
		});
	});
	test("Invalid body's slug --> return 400", () => {
		const type = "manga";
		const req = getMockReq({
			headers: { "content-type": "application/json" },
			body: { source: "asura" },
			is: () => req.headers["content-type"] === "application/json",
		});
		const { res, next } = getMockRes();
		validateBody(type)(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			statusCode: 400,
			statusText: `'slug' is empty`,
		});
	});
});
