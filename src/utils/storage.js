const STORAGE_KEY = "quotation-builder:saved-quotes";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Returns all saved quotes, most recently saved first.
export function getSavedQuotes() {
  return readAll().sort((a, b) => b.savedAt - a.savedAt);
}

// Saves (or updates, if the ref already exists) a quote and returns the full updated list.
export function saveQuote(quote) {
  const list = readAll();
  const existingIndex = list.findIndex((q) => q.ref === quote.ref);
  const entry = { ...quote, savedAt: Date.now() };

  if (existingIndex >= 0) {
    list[existingIndex] = entry;
  } else {
    list.push(entry);
  }

  writeAll(list);
  return getSavedQuotes();
}

// Deletes a quote by ref and returns the updated list.
export function deleteQuote(ref) {
  const list = readAll().filter((q) => q.ref !== ref);
  writeAll(list);
  return getSavedQuotes();
}
