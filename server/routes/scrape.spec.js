import router from "./scrape";

const routes = [
	{ path: "/manga-list", method: "post" },
	{ path: "/manga", method: "post" },
	{ path: "/chapter-list", method: "post" },
	{ path: "/chapter", method: "post" },
]

test.each(routes)("'$method' method exists on '$path'", (route) => {
	expect(router.stack.some((s) => Object.keys(s.route.methods).includes(route.method))).toBe(true);
	expect(router.stack.some((s) => s.route.path === route.path)).toBe(true);
});
