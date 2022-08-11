#!/usr/bin/env bash

url="https://o7m7nsil5gkwfauk5g34cm2ewe0hzhhm.lambda-url.ap-southeast-1.on.aws"

fetchList() {
	curl --request GET \
		--url "${url}/fetch/list"
}

fetchMangaList() {
	curl --request GET \
		--url "${url}/fetch/list/${1}"
}

fetchChapterList() {
	curl --request GET \
		--url "${url}/fetch/chapters/${1}/${2}"
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

postChapter() {
	curl --request POST \
		--url "${url}/scrape/chapter" \
		--header 'content-type: application/json' \
		--data '{ "source": "'$1'", "slug": "'$2'" }'
}

putContent() {
	curl --request PUT \
		--url "${url}/convert/chapter" \
		--header 'content-type: application/json' \
		--data '{ "source": "'$1'", "slug": "'$2'" }'
}

scrapeMangaData() {
	mapfile -t sourceList < <(fetchList | jq -r ".data[]")
	for x in "${!sourceList[@]}"; do
		postList "${sourceList[${x}]}"
		echo
		mapfile -t mangaList < <(fetchMangaList "${sourceList[x]}" | jq -r ".data[].Slug")
		for y in "${!mangaList[@]}"; do
			postManga "${sourceList[x]}" "${mangaList[${y}]}"
			echo
			mapfile -t chapterList < <(fetchChapterList "${sourceList[x]}" "${mangaList[${y}]}" | jq -r ".data[].Slug")
			for z in "${!chapterList[@]}"; do
				postChapter "${sourceList[x]}" "${chapterList[${z}]}"
				echo
			done
		done
	done
}

convertContent() {
	mapfile -t mangaList < <(fetchMangaList "asura" | jq -r ".data[].Slug")
	echo
	for y in "${!mangaList[@]}"; do
		mapfile -t chapterList < <(fetchChapterList "asura" "${mangaList[${y}]}" | jq -r ".data[].Slug")
		for z in "${!chapterList[@]}"; do
			putContent "asura" "${chapterList[${z}]}"
			echo
		done
	done
}

convertContent
