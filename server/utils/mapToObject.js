function mapToObject(map) {
	return Object.fromEntries(
		Array.from(map.entries(), function ([key, value]) {
			return value instanceof Map ? [key, mapToObject(value)] : [key, value];
		})
	);
}

export default mapToObject;
