# Proposal: Reel Log

**What I'm building:** A personal movie tracker where I log movies I've watched, rate them, and see stats about my own taste, like favorite genres and average rating by decade.

**Who it's for:** Myself. I watch a lot of movies but forget what I've seen and how I felt about it within a week, so I wanted a simple personal log instead of relying on memory.

**Core features:**
1. Search movies using the TMDB API and add them to a watched list.
2. Rate each watched movie (1 to 5) and optionally add a short note.
3. Store the watched list in the browser (localStorage) so it persists between visits.
4. A stats view showing patterns: most logged genres, average rating by decade, total movies logged.
5. Filter or sort the logged list itself (e.g. by rating or genre) so it stays usable once you've added a lot of movies.

**What I don't know yet:**
- How to keep the stats view from looking empty or broken when only a few movies are logged.
- Whether localStorage is reliable enough for this or if I'll want something sturdier later.
- How to structure the API key so it isn't committed directly into the public repo.

**Update after peer feedback (7/15):** A classmate pointed out the recommendation feature (pulling similar movies from TMDB) was more scope than I need for the time I have, so I cut it from the core feature list. They also pointed out I had no way to browse or filter my own log once it gets long, so I added filtering/sorting the logged list as feature 5 instead.