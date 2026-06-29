/**
 * Fetches a Wikipedia summary for a given topic to use as grounding context.
 * Wikipedia's REST API is CORS-friendly so this can be called from the browser.
 */
export async function fetchWikiContext(topic) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.extract ? data.extract.slice(0, 1500) : null;
  } catch {
    return null;
  }
}

/**
 * Calls our local Express proxy at /api/generate.
 * The CRA "proxy" field in package.json forwards this to http://localhost:5000.
 * The Express server then calls Anthropic with the API key — never exposed to the browser.
 */
export async function generateQuiz(topic, wikiContext = null) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, wikiContext }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Server error ${res.status}`);
  }

  return data;
}
