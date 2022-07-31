# Serverless Manga Scrapper on AWS

An API to get manga data from scanlation group that use [MangaReader](https://themesia.com/mangareader-wordpress-theme/) theme.

## Available Endpoints

|Description|Endpoint|
|-|-|
|Check available website list for scraping|[/scrape/list](https://mfv1h3g0kc.execute-api.ap-southeast-1.amazonaws.com/scrape/list)|
|Get manga list from a website source|/scrape/list/:source<br>e.g. [/scrape/list/flame](https://mfv1h3g0kc.execute-api.ap-southeast-1.amazonaws.com/scrape/list/flame)|
|Get manga's detail from a website source|/scrape/manga/:source/:title<br>e.g. [/scrape/manga/flame/berserk-of-gluttony](https://mfv1h3g0kc.execute-api.ap-southeast-1.amazonaws.com/scrape/manga/flame/berserk-of-gluttony)|
|Get chapter's content from a website source|/scrape/chapter/:source/:title<br>e.g. [/scrape/manga/flame/berserk-of-gluttony-chapter-39](https://mfv1h3g0kc.execute-api.ap-southeast-1.amazonaws.com/scrape/chapter/flame/berserk-of-gluttony-chapter-39)|
