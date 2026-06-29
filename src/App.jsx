import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
