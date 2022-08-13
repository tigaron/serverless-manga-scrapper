function objectIsEmpty(object) {
	for (const property in object) {
		return false;
	}
	return true;
}

export default objectIsEmpty;
