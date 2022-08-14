#!/usr/bin/env bash

url="https://2ggly3lb2rinkob5t5c52ps3yi0dutqy.lambda-url.ap-southeast-1.on.aws"

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

mapfile -t providerList < <(fetchProvider | jq -r ".data[]")
for x in "${!providerList[@]}"
do
postMangaList "${providerList[${x}]}"
echo
done

# mapfile -t mangaList < <(fetchMangaList "asura" | jq -r ".data.MangaList | keys[]")
# for x in "${!mangaList[@]}"; do
# 	mapfile -t chapterList < <(fetchMangaList "asura" | jq -r ".data.MangaList | keys[]")
# 	postChapterList "asura" "manga" "${mangaList[${x}]}"
# 	echo
# done
