import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateQuiz, fetchWikiContext } from '../utils/api';
import { saveResult } from '../utils/storage';
import QuestionCard from '../components/QuestionCard';
import ResultPanel from '../components/ResultPanel';
import styles from './Quiz.module.css';

const STEPS = { LOADING: 'loading', ANSWERING: 'answering', RESULT: 'result', ERROR: 'error' };

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic') || '';

  const [step, setStep] = useState(STEPS.LOADING);
  const [loadingMsg, setLoadingMsg] = useState('Fetching Wikipedia context…');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [wikiUsed, setWikiUsed] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!topic) { navigate('/'); return; }
    if (hasFetched.current) return;
    hasFetched.current = true;
    load();
  }, [topic]);

  async function load() {
    setStep(STEPS.LOADING);
    try {
      setLoadingMsg('Fetching Wikipedia context…');
      const wiki = await fetchWikiContext(topic);
      setWikiUsed(!!wiki);

      setLoadingMsg('Generating your quiz with AI…');
      const quiz = await generateQuiz(topic, wiki);
      setQuestions(quiz.questions);
      setStep(STEPS.ANSWERING);
    } catch (e) {
      setError(e.message);
      setStep(STEPS.ERROR);
    }
  }

  function handleSelect(questionId, letter) {
    setAnswers(prev => ({ ...prev, [questionId]: letter }));
  }

  function handleSubmit() {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) score++;
    });
    const res = {
      topic,
      score,
      total: questions.length,
      questions,
      answers,
    };
    saveResult(res);
    setResult(res);
    setStep(STEPS.RESULT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  if (step === STEPS.LOADING) {
    return (
      <div className={styles.page}>
        <NavBar onBack={() => navigate('/')} />
        <div className={styles.loadingCenter}>
          <div className={styles.spinner} />
          <p className={styles.loadingMsg}>{loadingMsg}</p>
          <p className={styles.loadingTopic}>"{topic}"</p>
        </div>
      </div>
    );
  }

  if (step === STEPS.ERROR) {
    return (
      <div className={styles.page}>
        <NavBar onBack={() => navigate('/')} />
        <div className={styles.errorCenter}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMsg}>{error}</p>
          <div className={styles.errorActions}>
            <button className={styles.retryBtn} onClick={load}>Try again</button>
            <button className={styles.backBtn} onClick={() => navigate('/')}>New topic</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.RESULT) {
    return (
      <div className={styles.page}>
        <NavBar onBack={() => navigate('/')} />
        <div className={styles.content}>
          <ResultPanel
            result={result}
            onRetry={() => {
              hasFetched.current = false;
              setAnswers({});
              setResult(null);
              load();
            }}
            onNewTopic={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <NavBar onBack={() => navigate('/')} />
      <div className={styles.content}>
        <div className={styles.quizHeader}>
          <div>
            <h1 className={styles.quizTopic}>{topic}</h1>
            {wikiUsed && (
              <span className={styles.wikiPill}>📖 Wikipedia-grounded</span>
            )}
          </div>
          <div className={styles.progress}>
            <span className={styles.progressText}>{answeredCount}/{questions.length} answered</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className={styles.questions}>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              selected={answers[q.id]}
              onSelect={(letter) => handleSelect(q.id, letter)}
            />
          ))}
        </div>

        <div className={styles.submitRow}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'Submit answers →' : `Answer all ${questions.length} questions to submit`}
          </button>
        </div>
      </div>
    </div>
  );
}

function NavBar({ onBack }) {
  return (
    <nav className={styles.nav}>
      <button className={styles.backBtn2} onClick={onBack}>
        ← Back
      </button>
      <div className={styles.navLogo}>⚡ QuizAI</div>
    </nav>
  );
}
