# Reel Log

A personal movie tracker. Search for movies, log the ones you've watched, rate them, jot a quick note, and see stats about your own taste build up over time.

**Live site:** [https://aoberoi14.github.io/reel-log/](https://aoberoi14.github.io/reel-log/)

## What does this project do?

Reel Log lets you:

- Search any movie via the TMDB API
- Add movies to a personal watched log (saved in your browser, so it's yours alone)
- Rate each movie 1 to 5 stars and add a short note
- Sort and filter your log by rating, title, year, or genre once it starts growing
- See stats on your taste: total movies logged, average rating, top genres, and a breakdown by decade

## How do I use it?

1. Open the live site (link above).
2. Search for a movie you've watched using the search bar.
3. Click **Add to log** on the result.
4. In the **Your log** section, rate it and optionally add a note.
5. Use the Sort and Genre controls above your log to reorder or narrow it down as it grows.
6. Scroll down to see your stats update automatically as you log and rate more movies.

Everything is stored locally in your browser. Clearing your browser data clears your log.

## Running it locally / setting up the API key

This project uses [TMDB](https://www.themoviedb.org/) for movie data, which requires a free API key.

1. Create a free account at themoviedb.org and grab an API key from your account settings (API section).
2. Copy `js/config.example.js` to `js/config.js`.
3. Paste your key into `js/config.js`:
   ```js
   const TMDB_API_KEY = "your-real-key-here";
   ```
4. `js/config.js` is listed in `.gitignore`, so your key stays out of the public repo.
5. Open `index.html` in a browser (or serve the folder with any static file server).

## What I learned building this

_Fill in after building: what surprised you, what you had to debug, what you'd do differently._