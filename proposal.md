# Proposal: Reel Log

**What I'm building:** A personal movie tracker where I log movies I've watched, rate them, and see stats about my own taste, like favorite genres and average rating by decade.

**Who it's for:** Myself. I watch a lot of movies but forget what I've seen and how I felt about it within a week, so I wanted a simple personal log instead of relying on memory.

**Core features:**
1. Search movies using the TMDB API and add them to a watched list.
2. Rate each watched movie (1 to 5) and optionally add a short note.
3. Store the watched list in the browser (localStorage) so it persists between visits.
4. A stats view showing patterns: most logged genres, average rating by decade, total movies logged.
5. A simple recommendation pull: pick your highest rated movie and surface a few similar titles from TMDB.

**What I don't know yet:**
- How much of TMDB's built in recommendation/similar-movies endpoint to lean on versus writing my own genre matching logic.
- How to keep the stats view from looking empty or broken when only a few movies are logged.
- Whether localStorage is reliable enough for this or if I'll want something sturdier later.
- How to structure the API key so it isn't committed directly into the public repo.