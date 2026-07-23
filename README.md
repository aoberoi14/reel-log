# Reel Log

A personal movie tracker for people who watch a lot but remember little. Search for a movie, log it, rate it, jot a note, and watch your own taste turn into real numbers over time.

**Live site:** [https://aoberoi14.github.io/reel-log/](https://aoberoi14.github.io/reel-log/)

---

## What does this project do?

Reel Log is a single-page web app that lets you:

- **Search** any movie using live data from [TMDB](https://www.themoviedb.org/) (posters, titles, release years)
- **Log** movies you've watched, one click to add
- **Rate** each logged movie 1 to 5 stars, and add an optional short note
- **Sort and filter** your log by rating, title, release year, or genre, so it stays usable as it grows
- **See stats** on your own taste: total movies logged, average rating, top genres, and a breakdown by decade

It's built for one person's private use. There are no accounts and nothing is shared, your log is just yours.

---

## How do I use it?

1. Open the live site: [https://aoberoi14.github.io/reel-log/](https://aoberoi14.github.io/reel-log/)
2. Type a movie title into the search bar at the top and hit **Search**.
3. Find your movie in the results and click **Add to log**.
4. Scroll to **Your log**. Click the stars to rate it (1 to 5), and type a short note in the box below it if you want. Notes save automatically when you click away.
5. Once you've logged a few movies, use the **Sort** and **Genre** dropdowns above your log to reorder it or narrow it down.
6. Scroll to **Your taste, in numbers** to see stats update live: how many movies you've logged, your average rating, your most-logged genres, and which decades you watch the most.
7. To remove a movie from your log, click **Remove** on its entry.

Everything is stored locally in your own browser (`localStorage`). It does not sync across devices, and clearing your browser's site data will clear your log. This is intentional: it keeps the app fully static with no backend or account system required.

---

## Project structure

```
reel-log/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── config.js
│   └── config.example.js
├── PROPOSAL.md
└── README.md
```

---

## Running it locally

This project uses the [TMDB API](https://www.themoviedb.org/) for all movie data, which requires a free API key.

1. Clone or download this repo.
2. Get a free TMDB account and API key: themoviedb.org → Settings → API → request a key (choose "Developer," personal use).
3. Open `js/config.js` and confirm it has a valid key:
   ```js
   const TMDB_API_KEY = "your-key-here";
   ```
4. Open `index.html` directly in a browser, or serve the folder with any static file server (e.g. the VS Code Live Server extension).

**A note on the API key and `.gitignore`:** Since this app is deployed as a fully static site on GitHub Pages with no backend, there's no server-side place to keep the key hidden, it has to be readable by the browser to make API calls. TMDB's key is a rate-limited public identifier designed to be used this way in client-side apps, not a secret like a password. So unlike typical backend projects, `config.js` here is committed to the repo rather than gitignored. `config.example.js` stays as a placeholder template for anyone setting up their own copy with their own key.

---

## Built with

- Plain HTML, CSS, and JavaScript, no frameworks or build step
- [TMDB API](https://www.themoviedb.org/documentation/api) for movie search, genre data, and posters
- Browser `localStorage` for all persistence
- Deployed on GitHub Pages

---

## Known limitations

- No cross-device sync, your log lives only in the browser you used to build it
- No way to undo a "Remove" once confirmed
- Stats are based only on what's in your log, so they're sparse and not very meaningful until you've logged a handful of movies

---

## What I learned building this

The core app logic (search, add-to-log, rate, redraw stats) came together quickly since it's mostly straightforward DOM updates driven by one array of watched movies. The two things that actually taught me something were both deployment problems, not coding problems.

First, I initially followed standard practice and put my TMDB API key in a gitignored `config.js`, keeping it out of the public repo. That's correct for apps with a backend, but it broke my deployment: GitHub Pages only serves static files, so a file that never gets pushed to GitHub is a file the live site can never load either. I had to understand *why* that pattern didn't apply here before I could fix it, rather than just following the advice by default.

Second, a CSS bug taught me something I hadn't hit before: my genre and decade bar charts were rendering with zero visible height because I'd used `<span>` elements (inline by default) for the bar track and fill, and CSS `height` doesn't apply to inline elements. Adding `display: block` fixed it immediately, small fix, but a good reminder to actually know why a rule isn't applying instead of guessing at random properties.

If I had another week, I'd add the ability to edit a rating directly from the stats view, and look into a lightweight export option so a log isn't permanently stuck to one browser.