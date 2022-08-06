# Serverless Manga Scrapper on AWS

An API to get manga data from scanlation group that use [MangaReader](https://themesia.com/mangareader-wordpress-theme/) theme.

## Available Website for Scraping

- [`alpha`](https://alpha-scans.org/)
- [`asura`](https://asurascans.com/)
- [`flame`](https://flamescans.org/)
- [`luminous`](https://luminousscans.com/)
- [`realm`](https://realmscans.com/)

## Available Endpoints

|HTTP Method|Description|Endpoint|Example|
|-|-|-|-|
|GET|Get available website source|/fetch/list|path: `/fetch/list`|
|GET|Get manga list from a website source|/fetch/manga/:source|path: `/fetch/manga/alpha`|
|GET|Get manga's detail from a website source|/fetch/manga/:source/:title|path: `/fetch/manga/realm/series+chronicles-of-a-returner`|
|GET|Get chapter's content from a website source|/fetch/chapter/:source/:title|path: `/fetch/chapter/asura/academys-undercover-professor-chapter-16`|
|POST|Scrape a new manga list from a website source|/scrape/list|path: `/scrape/list`<br>headers: `{ "content-type": "application/json" }`<br>body: `{ "source": "luminous" }`|
|POST|Scrape a new manga's detail from a website source|/scrape/manga|path: `/scrape/manga`<br>headers: `{ "content-type": "application/json" }`<br>body: `{ "source": "asura", "slug": "comics+1649969363-solo-leveling" }`|
|POST|Scrape a new chapter's content from a website source|/scrape/chapter|path: `/scrape/chapter`<br>headers: `{ "content-type": "application/json" }`<br>body: `{ "source": "flame", "slug": "berserk-of-gluttony-chapter-39" }`|

## My todo list
- PUT: update specific item in database
- DELETE: remove specific item in database
- Authorization for POST, PUT, and DELETE method