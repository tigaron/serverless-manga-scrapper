import router from "./fetch";

const routes = [
	{ path: "/", method: "get" },
	{ path: "/status/:id", method: "get" },
	{ path: "/manga-provider", method: "get" },
	{ path: "/manga-list/:provider", method: "get" },
	{ path: "/manga/:provider/:slug", method: "get" },
	{ path: "/chapter-list/:provider/:slug", method: "get" },
	{ path: "/chapter/:provider/:manga/:slug", method: "get" },
]

test.each(routes)("'$method' method exists on '$path'", (route) => {
	expect(router.stack.some((s) => Object.keys(s.route.methods).includes(route.method))).toBe(true);
	expect(router.stack.some((s) => s.route.path === route.path)).toBe(true);
});
