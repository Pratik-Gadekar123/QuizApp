import React from 'react';
import styles from './QuestionCard.module.css';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({ question, index, selected, onSelect, showResult = false }) {
  return (
    <div className={styles.card}>
      <div className={styles.qMeta}>
        <span className={styles.qNum}>Question {index + 1}</span>
      </div>
      <p className={styles.qText}>{question.question}</p>
      <div className={styles.options}>
        {LETTERS.map(letter => {
          let optClass = styles.option;
          let icon = null;

          if (showResult) {
            if (letter === question.answer) {
              optClass = `${styles.option} ${styles.correct}`;
              icon = <span className={styles.optIcon}>✓</span>;
            } else if (letter === selected && selected !== question.answer) {
              optClass = `${styles.option} ${styles.wrong}`;
              icon = <span className={styles.optIcon}>✗</span>;
            }
          } else {
            if (letter === selected) optClass = `${styles.option} ${styles.selected}`;
          }

          return (
            <button
              key={letter}
              className={optClass}
              onClick={() => !showResult && onSelect(letter)}
              disabled={showResult}
            >
              <span className={styles.optLetter}>{letter}</span>
              <span className={styles.optText}>{question.options[letter]}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {showResult && question.explanation && (
        <div className={styles.explanation}>
          <span className={styles.explIcon}>💡</span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}
