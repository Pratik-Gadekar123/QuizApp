import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, clearHistory, formatDate, formatTime } from '../utils/storage';
import styles from './Home.module.css';

const SUGGESTED_TOPICS = [
  'Photosynthesis', 'Ancient Rome', 'Neural Networks', 'The Solar System',
  'World War II', 'Quantum Mechanics', 'The French Revolution', 'DNA & Genetics',
  'Climate Change', 'The Renaissance', 'Machine Learning', 'Human Anatomy',
];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  function handleGenerate(e) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;
    navigate(`/quiz?topic=${encodeURIComponent(trimmed)}`);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  function getBadgeClass(pct) {
    if (pct >= 80) return styles.badgeGood;
    if (pct >= 50) return styles.badgeMid;
    return styles.badgeLow;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>QuizAI</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Generate any quiz,<br />instantly</h1>
          <p className={styles.subtitle}>
            Enter a topic and get 5 AI-generated multiple-choice questions with instant grading and explanations.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleGenerate}>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter a topic — e.g. Photosynthesis, Ancient Rome…"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              maxLength={80}
              autoFocus
            />
            <button
              className={styles.generateBtn}
              type="submit"
              disabled={!topic.trim()}
            >
              Generate quiz →
            </button>
          </div>
          <p className={styles.hint}>
            <span className={styles.wikiChip}>📖 Wikipedia</span>
            Context is automatically fetched for better accuracy
          </p>
        </form>

        <div className={styles.suggestions}>
          <p className={styles.suggestLabel}>Try a topic</p>
          <div className={styles.chips}>
            {SUGGESTED_TOPICS.map(t => (
              <button
                key={t}
                className={styles.chip}
                onClick={() => navigate(`/quiz?topic=${encodeURIComponent(t)}`)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h2 className={styles.historyTitle}>Past quizzes</h2>
              <button className={styles.clearBtn} onClick={handleClearHistory}>
                Clear history
              </button>
            </div>
            <div className={styles.historyList}>
              {history.map(entry => (
                <div key={entry.id} className={styles.historyItem}>
                  <div className={styles.historyLeft}>
                    <span className={styles.historyTopic}>{entry.topic}</span>
                    <span className={styles.historyDate}>
                      {formatDate(entry.date)} · {formatTime(entry.date)}
                    </span>
                  </div>
                  <span className={`${styles.badge} ${getBadgeClass(entry.percentage)}`}>
                    {entry.score}/{entry.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
