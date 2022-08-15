#!/usr/bin/env bash

url="https://hojsn64cstjnlpdrpn72exvg3a0kmhtx.lambda-url.ap-southeast-1.on.aws"

# OK
fetchProvider() {
	curl --request GET \
		--url "${url}/fetch/manga-provider"
}

# OK
fetchMangaList() {
	curl --request GET \
		--url "${url}/fetch/manga-list/${1}"
}

# OK
fetchManga() {
	curl --request GET \
		--url "${url}/fetch/manga/${1}/${2}"
}

# OK
fetchChapterList() {
	curl --request GET \
		--url "${url}/fetch/chapter-list/${1}/${2}"
}

# OK
postMangaList() {
	curl --request POST \
		--url "${url}/scrape/manga-list" \
		--header 'content-type: application/json' \
		--data '{ "provider": "'$1'" }'
}

# OK
postManga() {
	curl --request POST \
		--url "${url}/scrape/manga" \
		--header 'content-type: application/json' \
		--data '{ "provider": "'$1'", "slug": "'$2'" }'
}

# OK
postChapterList() {
	curl --request POST \
		--url "${url}/scrape/chapter-list" \
		--header 'content-type: application/json' \
		--data '{ "provider": "'$1'", "slug": "'$2'" }'
}

# OK
postChapter() {
	curl --request POST \
		--url "${url}/scrape/chapter" \
		--header 'content-type: application/json' \
		--data '{ "provider": "'$1'", "manga": "'$2'", "slug": "'$3'" }'
}

# Scrape manga-list
scrapeMangaList() {
	mapfile -t providerList < <(fetchProvider | jq -r ".data[]")
	for x in "${!providerList[@]}"
	do
	postMangaList "${providerList[${x}]}"
	sleep 5
	echo
	done
}

scrapeManga() {
	mapfile -t providerList < <(fetchProvider | jq -r ".data[]")
	for x in "${!providerList[@]}"
	do
		mapfile -t mangaList < <(fetchMangaList "${providerList[${x}]}" | jq -r ".data[].EntrySlug")
		for y in "${!mangaList[@]}"
		do
		postManga "${providerList[${x}]}" "${mangaList[${y}]}"
		sleep 5
		echo
		done
	done
}

scrapeChapterList() {
	mapfile -t providerList < <(fetchProvider | jq -r ".data[]")
	for x in "${!providerList[@]}"
	do
		mapfile -t mangaList < <(fetchMangaList "${providerList[${x}]}" | jq -r ".data[].EntrySlug")
		for y in "${!mangaList[@]}"
		do
		postChapterList "${providerList[${x}]}" "${mangaList[${y}]}"
		sleep 5
		echo
		done
	done
}

scrapeChapter() {
	mapfile -t providerList < <(fetchProvider | jq -r ".data[]")
	for x in "${!providerList[@]}"
	do
		mapfile -t mangaList < <(fetchMangaList "${providerList[${x}]}" | jq -r ".data[].EntrySlug")
		for y in "${!mangaList[@]}"
		do
			mapfile -t chapterList < <(fetchChapterList "${providerList[${x}]}" "${mangaList[${y}]}" | jq -r ".data[].EntrySlug")
			for z in "${!chapterList[@]}"
			do
				postChapter "${providerList[${x}]}" "${mangaList[${y}]}" "${chapterList[${z}]}"
				sleep 3
				echo
			done
		done
	done
}
