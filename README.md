# Serverless Manga Scrapper on AWS

An API to get manga data from scanlation group that use [MangaReader](https://themesia.com/mangareader-wordpress-theme/) theme.

## Available Website for Scraping

- [`alpha`](https://alpha-scans.org/)
- [`asura`](https://asurascans.com/)
- [`flame`](https://flamescans.org/)
- [`luminous`](https://luminousscans.com/)
- [`realm`](https://realmscans.com/)

## Available Endpoints

<table>
	<tr>
		<th>HTTP Method</th>
		<th>Endpoint</th>
		<th>Description</th>
		<th>Example</th>
	</tr>
	<tr>
		<td>GET</td>
		<td>/fetch/manga-provider</td>
		<td>Fetch available website providers</td>
		<td>path: <a href="/fetch/manga-provider">/fetch/manga-provider</a></td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/fetch/manga-list/{provider}</td>
		<td>Fetch manga list from a website provider</td>
		<td>path: <a href="/fetch/manga-list/alpha">/fetch/manga-list/alpha</a></td>
	</tr>
	<tr>
			<td>GET</td>
			<td>/fetch/manga/{provider}/{slug}</td>
			<td>Fetch information of a specific manga from a website provider</td>
			<td>path: <a href="/fetch/manga/realm/chronicles-of-a-returner">/fetch/manga/realm/chronicles-of-a-returner</a></td>
	</tr>
	<tr>
			<td>GET</td>
			<td>/fetch/chapter-list/{provider}/{slug}</td>
			<td>Fetch chapter list of a specific manga from a website provider</td>
			<td>path: <a href="/fetch/chapter-list/asura/worthless-regression">/fetch/chapter-list/asura/worthless-regression</a></td>
	</tr>
	<tr>
			<td>GET</td>
			<td>/fetch/chapter/{provider}/{manga}/{slug}</td>
			<td>Fetch information of a specific chapter from a website provider</td>
			<td>path: <a href="/fetch/chapter/asura/academys-undercover-professor/academys-undercover-professor-chapter-16">/fetch/chapter/asura/academys-undercover-professor/academys-undercover-professor-chapter-16</a></td>
	</tr>
	<tr>
			<td>POST</td>
			<td>/scrape/manga-list</td>
			<td>Scrape a new manga list from a website provider</td>
			<td>
				path: /scrape/manga-list
				<br>
				headers: { "content-type": "application/json" }
				<br>
				body: { "provider": "luminous" }
			</td>
	</tr>
	<tr>
			<td>POST</td>
			<td>/scrape/manga</td>
			<td>Scrape new information for a specific manga from a website provider</td>
			<td>
				path: /scrape/manga
				<br>
				headers: { "content-type": "application/json" }
				<br>
				body: { "provider": "asura", "slug": "solo-leveling"}
			</td>
	</tr>
	<tr>
			<td>POST</td>
			<td>/scrape/chapter-list</td>
			<td>Scrape a new chapter list for a specific manga from a website provider</td>
			<td>
				path: /scrape/chapter-list
				<br>
				headers: { "content-type": "application/json" }
				<br>
				body: { "provider": "asura", "slug": "damn-reincarnation"}
			</td>
	</tr>
	<tr>
			<td>POST</td>
			<td>/scrape/chapter</td>
			<td>Scrape new content for a specific manga chapter from a website provider</td>
			<td>
				path: /scrape/chapter
				<br>
				headers: { "content-type": "application/json" }
				<br>
				body: { "provider": "flame", "manga": "berserk-of-gluttony", "slug": "berserk-of-gluttony-chapter-39"}
			</td>
	</tr>
</table>
				
## My todo list
- PUT: update specific item in database
- DELETE: remove specific item in database
- Authorization for POST, PUT, and DELETE method
