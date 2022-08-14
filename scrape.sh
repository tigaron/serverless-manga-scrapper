#!/usr/bin/env bash

url="https://o7m7nsil5gkwfauk5g34cm2ewe0hzhhm.lambda-url.ap-southeast-1.on.aws"

# OK
fetchList() {
	curl --request GET \
		--url "${url}/fetch/manga-provider"
}

# OK
fetchMangaList() {
	curl --request GET \
		--url "${url}/fetch/manga-list/${1}"
}

fetchMangaList() {
	curl --request GET \
		--url "${url}/fetch/chapter-list/${1}/${2}"
}

# OK
postList() {
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
		--data '{ "provider": "'$1'", "type": "'$2'", "slug": "'$3'" }'
}

# OK
postChapterList() {
	curl --request POST \
		--url "${url}/scrape/chapter-list" \
		--header 'content-type: application/json' \
		--data '{ "provider": "'$1'", "type": "'$2'", "slug": "'$3'" }'
}

postChapter() {
	curl --request POST \
		--url "${url}/scrape/chapter" \
		--header 'content-type: application/json' \
		--data '{ "provider": "'$1'", "slug": "'$2'" }'
}

# putContent() {
# 	curl --request PUT \
# 		--url "${url}/convert/chapter" \
# 		--header 'content-type: application/json' \
# 		--data '{ "provider": "'$1'", "slug": "'$2'" }'
# }

# mapfile -t mangaList < <(fetchMangaList "asura" | jq -r ".data.MangaList | keys[]")
# for x in "${!mangaList[@]}"; do
# 	mapfile -t chapterList < <(fetchMangaList "asura" | jq -r ".data.MangaList | keys[]")
# 	postChapterList "asura" "manga" "${mangaList[${x}]}"
# 	echo
# done
