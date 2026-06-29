const HISTORY_KEY = 'quiz_history';

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveResult(result) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    topic: result.topic,
    score: result.score,
    total: result.total,
    percentage: Math.round((result.score / result.total) * 100),
    date: new Date().toISOString(),
    questions: result.questions,
    answers: result.answers,
  };
  history.unshift(entry);
  // Keep last 20 results
  const trimmed = history.slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  return entry;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
