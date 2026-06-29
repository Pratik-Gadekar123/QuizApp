import React from 'react';
import QuestionCard from './QuestionCard';
import styles from './ResultPanel.module.css';

export default function ResultPanel({ result, onRetry, onNewTopic }) {
  const { score, total, topic, questions, answers } = result;
  const pct = Math.round((score / total) * 100);

  const grade = pct >= 90 ? { label: 'Excellent!', emoji: '🏆', cls: styles.gradeA }
    : pct >= 70 ? { label: 'Good work!', emoji: '🎯', cls: styles.gradeB }
    : pct >= 50 ? { label: 'Not bad.', emoji: '📚', cls: styles.gradeC }
    : { label: 'Keep studying.', emoji: '💪', cls: styles.gradeD };

  return (
    <div className={styles.panel}>
      <div className={`${styles.scoreCard} ${grade.cls}`}>
        <div className={styles.scoreEmoji}>{grade.emoji}</div>
        <div className={styles.scoreBig}>{score}<span className={styles.scoreOf}>/{total}</span></div>
        <div className={styles.scoreLabel}>{grade.label}</div>
        <div className={styles.scoreTopic}>{topic}</div>
        <div className={styles.scoreBar}>
          <div className={styles.scoreFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.scorePct}>{pct}%</div>
      </div>

      <div className={styles.actions}>
        <button className={styles.retryBtn} onClick={onRetry}>↺ Retry this topic</button>
        <button className={styles.newBtn} onClick={onNewTopic}>+ New topic</button>
      </div>

      <div className={styles.reviewSection}>
        <h2 className={styles.reviewTitle}>Answer review</h2>
        <div className={styles.reviewList}>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              selected={answers[q.id]}
              showResult={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
