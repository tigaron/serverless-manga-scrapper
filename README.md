# Serverless Manga Scrapper on AWS

An API to get manga data from scanlation group that use [MangaReader](https://themesia.com/mangareader-wordpress-theme/) theme.

## Available Website for Scraping

- [`alpha`](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/alpha)
- [`asura`](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/asura)
- [`flame`](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/flame)
- [`luminous`](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/luminous)
- [`realm`](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/realm)
## Available Endpoints

|Description|Endpoint|
|-|-|
|GET available website source for scraping|[/scrape/list](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/)|
|GET manga list from a website source|/scrape/list/:source<br>e.g. [/scrape/list/asura](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/list/asura)|
|GET manga's detail from a website source|/scrape/manga/:source/:title<br>e.g. [/scrape/manga/realm/series+chronicles-of-a-returner](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/manga/realm/series+chronicles-of-a-returner)|
|GET chapter's content from a website source|/scrape/chapter/:source/:title<br>e.g. [/scrape/manga/flame/berserk-of-gluttony-chapter-39](https://7iwr725hi4.execute-api.ap-southeast-1.amazonaws.com/scrape/chapter/flame/berserk-of-gluttony-chapter-39)|
