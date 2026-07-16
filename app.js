// ---------- Config ----------
const API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect width='200' height='300' fill='%23262636'/%3E%3C/svg%3E";
const STORAGE_KEY = "reel-log-watched";

// ---------- State ----------
let genreMap = {}; // { 27: "Horror", ... }
let watched = loadLog();
let currentSort = "newest";
let currentGenreFilter = "all";

// ---------- DOM refs ----------
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

const logControls = document.getElementById("log-controls");
const sortSelect = document.getElementById("sort-select");
const genreFilterSelect = document.getElementById("genre-filter");
const logList = document.getElementById("log-list");
const logEmptyMsg = document.getElementById("log-empty-msg");
const logNoMatchMsg = document.getElementById("log-no-match-msg");

const statsEmptyMsg = document.getElementById("stats-empty-msg");
const statsContent = document.getElementById("stats-content");
const statTotal = document.getElementById("stat-total");
const statAvg = document.getElementById("stat-avg");
const genreBars = document.getElementById("genre-bars");
const decadeBars = document.getElementById("decade-bars");

// ---------- Init ----------
init();

async function init() {
  await loadGenres();
  renderLog();
  renderStats();
}

// ---------- localStorage helpers ----------
function loadLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read saved log:", err);
    return [];
  }
}

function saveLog() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watched));
  } catch (err) {
    console.error("Could not save log:", err);
  }
}

// ---------- TMDB API ----------
async function loadGenres() {
  try {
    const res = await fetch(`${API_BASE}/genre/movie/list?api_key=${TMDB_API_KEY}`);
    if (!res.ok) throw new Error("Genre list request failed");
    const data = await res.json();
    data.genres.forEach((g) => (genreMap[g.id] = g.name));
  } catch (err) {
    console.error("Could not load genre list:", err);
  }
}

async function searchMovies(query) {
  const res = await fetch(
    `${API_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Search request failed");
  const data = await res.json();
  return data.results || [];
}

// ---------- Search UI ----------
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  searchResults.innerHTML = `<p class="empty-msg">Searching...</p>`;
  try {
    const results = await searchMovies(query);
    renderSearchResults(results);
  } catch (err) {
    searchResults.innerHTML = `<p class="empty-msg">Couldn't reach TMDB. Check your API key in js/config.js and your connection, then try again.</p>`;
    console.error(err);
  }
});

function renderSearchResults(results) {
  if (results.length === 0) {
    searchResults.innerHTML = `<p class="empty-msg">No movies found for that search.</p>`;
    return;
  }

  searchResults.innerHTML = "";
  results.slice(0, 12).forEach((movie, index) => {
    const alreadyLogged = watched.some((m) => m.id === movie.id);
    const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
    const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : PLACEHOLDER_POSTER;

    const card = document.createElement("div");
    card.className = "movie-card fade-in";
    card.style.animationDelay = `${index * 30}ms`;
    card.innerHTML = `
      <img src="${poster}" alt="Poster for ${escapeHtml(movie.title)}" loading="lazy">
      <div class="card-body">
        <h3>${escapeHtml(movie.title)}</h3>
        <span class="year">${year}</span>
        <button class="add-btn" ${alreadyLogged ? "disabled" : ""}>
          ${alreadyLogged ? "In your log" : "Add to log"}
        </button>
      </div>
    `;
    const btn = card.querySelector(".add-btn");
    if (!alreadyLogged) {
      btn.addEventListener("click", () => addToLog(movie));
    }
    searchResults.appendChild(card);
  });
}

// ---------- Log management ----------
function addToLog(movie) {
  if (watched.some((m) => m.id === movie.id)) return;
  watched.push({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date || "",
    poster_path: movie.poster_path || "",
    genre_ids: movie.genre_ids || [],
    rating: 0,
    note: "",
    addedAt: Date.now(),
  });
  saveLog();
  refreshGenreFilterOptions();
  renderLog();
  renderStats();
  // Refresh the search grid so the "Add" button flips to "In your log"
  if (searchInput.value.trim()) searchForm.requestSubmit();
}

function removeFromLog(movieId) {
  watched = watched.filter((m) => m.id !== movieId);
  saveLog();
  refreshGenreFilterOptions();
  renderLog();
  renderStats();
}

function setRating(movieId, rating) {
  const entry = watched.find((m) => m.id === movieId);
  if (!entry) return;
  entry.rating = rating;
  saveLog();
  renderStats();
}

function setNote(movieId, note) {
  const entry = watched.find((m) => m.id === movieId);
  if (!entry) return;
  entry.note = note;
  saveLog();
}

// ---------- Sort & filter controls ----------
sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderLog();
});

genreFilterSelect.addEventListener("change", (e) => {
  currentGenreFilter = e.target.value;
  renderLog();
});

function refreshGenreFilterOptions() {
  const genresInUse = new Set();
  watched.forEach((m) => (m.genre_ids || []).forEach((id) => genresInUse.add(id)));

  const previousValue = genreFilterSelect.value;
  genreFilterSelect.innerHTML = `<option value="all">All genres</option>`;
  [...genresInUse]
    .map((id) => ({ id, name: genreMap[id] || "Other" }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(({ id, name }) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = name;
      genreFilterSelect.appendChild(opt);
    });

  // keep the user's selection if it's still valid, otherwise reset to "all"
  const stillValid = [...genreFilterSelect.options].some((o) => o.value === previousValue);
  genreFilterSelect.value = stillValid ? previousValue : "all";
  currentGenreFilter = genreFilterSelect.value;
}

function getVisibleLog() {
  let list = [...watched];

  if (currentGenreFilter !== "all") {
    const genreId = Number(currentGenreFilter);
    list = list.filter((m) => (m.genre_ids || []).includes(genreId));
  }

  switch (currentSort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "title":
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "year":
      list.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
      break;
    case "newest":
    default:
      list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      break;
  }

  return list;
}

function renderLog() {
  if (watched.length === 0) {
    logControls.hidden = true;
    logEmptyMsg.hidden = false;
    logNoMatchMsg.hidden = true;
    logList.innerHTML = "";
    return;
  }
  logControls.hidden = false;
  logEmptyMsg.hidden = true;

  const visible = getVisibleLog();

  if (visible.length === 0) {
    logNoMatchMsg.hidden = false;
    logList.innerHTML = "";
    return;
  }
  logNoMatchMsg.hidden = true;

  logList.innerHTML = "";
  visible.forEach((movie, index) => {
    const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
    const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : PLACEHOLDER_POSTER;

    const stub = document.createElement("div");
    stub.className = "ticket-stub fade-in";
    stub.style.animationDelay = `${index * 25}ms`;
    stub.innerHTML = `
      <img src="${poster}" alt="Poster for ${escapeHtml(movie.title)}" loading="lazy">
      <div class="stub-main">
        <h3>${escapeHtml(movie.title)}</h3>
        <span class="year">${year}</span>
        <div class="stars" role="radiogroup" aria-label="Rating for ${escapeHtml(movie.title)}"></div>
        <textarea class="stub-note" placeholder="Quick note (optional)" rows="1">${escapeHtml(
          movie.note || ""
        )}</textarea>
      </div>
      <div class="stub-actions">
        <button class="remove-btn" type="button">Remove</button>
      </div>
    `;

    const starsContainer = stub.querySelector(".stars");
    for (let i = 1; i <= 5; i++) {
      const starBtn = document.createElement("button");
      starBtn.type = "button";
      starBtn.textContent = "★";
      starBtn.className = i <= movie.rating ? "filled" : "";
      starBtn.setAttribute("aria-label", `${i} star${i > 1 ? "s" : ""}`);
      starBtn.addEventListener("click", () => {
        setRating(movie.id, i);
        renderLog();
      });
      starsContainer.appendChild(starBtn);
    }

    stub.querySelector(".remove-btn").addEventListener("click", () => removeFromLog(movie.id));
    stub.querySelector(".stub-note").addEventListener("change", (e) => setNote(movie.id, e.target.value));

    logList.appendChild(stub);
  });
}

// ---------- Stats ----------
function renderStats() {
  if (watched.length === 0) {
    statsEmptyMsg.hidden = false;
    statsContent.hidden = true;
    return;
  }
  statsEmptyMsg.hidden = true;
  statsContent.hidden = false;

  statTotal.textContent = watched.length;

  const rated = watched.filter((m) => m.rating > 0);
  statAvg.textContent = rated.length
    ? (rated.reduce((sum, m) => sum + m.rating, 0) / rated.length).toFixed(1)
    : "—";

  // Genre counts
  const genreCounts = {};
  watched.forEach((m) => {
    (m.genre_ids || []).forEach((id) => {
      const name = genreMap[id] || "Other";
      genreCounts[name] = (genreCounts[name] || 0) + 1;
    });
  });
  renderBars(genreBars, genreCounts, 5);

  // Decade counts
  const decadeCounts = {};
  watched.forEach((m) => {
    if (!m.release_date) return;
    const year = parseInt(m.release_date.slice(0, 4), 10);
    if (isNaN(year)) return;
    const decade = `${Math.floor(year / 10) * 10}s`;
    decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
  });
  renderBars(decadeBars, decadeCounts, 8, true);
}

function renderBars(container, counts, limit, sortByKey = false) {
  const entries = Object.entries(counts);
  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-msg">Not enough data yet.</p>`;
    return;
  }
  entries.sort((a, b) => (sortByKey ? a[0].localeCompare(b[0]) : b[1] - a[1]));
  const shown = entries.slice(0, limit);
  const max = Math.max(...shown.map((e) => e[1]));

  container.innerHTML = "";
  shown.forEach(([label, count]) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${escapeHtml(label)}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${(count / max) * 100}%"></span></span>
      <span>${count}</span>
    `;
    container.appendChild(row);
  });
}

// ---------- Utilities ----------
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}