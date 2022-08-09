#!/usr/bin/env bash

url="https://el0uvhdr9i.execute-api.ap-southeast-1.amazonaws.com"

fetchList() {
	curl --request GET \
		--url "${url}/fetch/list"
}

fetchMangaList() {
	curl --request GET \
		--url "${url}/fetch/list/${1}"
}

postList() {
	curl --request POST \
		--url "${url}/scrape/list" \
		--header 'content-type: application/json' \
		--data '{ "source": "'$1'" }'
}

postManga() {
	curl --request POST \
		--url "${url}/scrape/manga" \
		--header 'content-type: application/json' \
		--data '{ "source": "'$1'", "slug": "'$2'" }'
}

scrapeMangaList() {
	mapfile -t sourceList < <(fetchList | jq -r ".data[]")
	for x in "${!sourceList[@]}"; do
		postList "${sourceList[${x}]}"
		echo
		mapfile -t mangaList< <(fetchMangaList "${sourceList[x]}" | jq -r ".data[].Slug")
		for y in "${!mangaList[@]}"; do
			postManga "${sourceList[x]}" "${mangaList[${y}]}"
			echo
		done
	done
}

scrapeMangaList