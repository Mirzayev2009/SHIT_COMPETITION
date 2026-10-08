"use client";

import { useState } from "react";
import { ArrowRight, BookOpenCheck, Check, CheckCircle2, Link2, RotateCcw, X } from "lucide-react";
import type { CareMapAnalysis, Language } from "@/lib/schema";
import { ui } from "@/lib/translations";

type UnderstandingQuizProps = {
  quiz: CareMapAnalysis["quiz"];
  language: Language;
  onInspect: (quote: string) => void;
};

export function UnderstandingQuiz({ quiz, language, onInspect }: UnderstandingQuizProps) {
  const t = ui[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const current = quiz[currentIndex];
  const answered = selectedIndex !== null;
  const correct = current && selectedIndex === current.correctAnswerIndex;

  function restart() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setFinished(false);
  }

  function next() {
    if (currentIndex + 1 === quiz.length) setFinished(true);
    else { setCurrentIndex((index) => index + 1); setSelectedIndex(null); }
  }

  return (
    <section className="care-panel care-quiz" aria-labelledby="care-quiz-heading">
      <div className="care-section-heading"><div><h2 id="care-quiz-heading">{t.quizTitle}</h2><p>{t.quizDescription}</p></div><BookOpenCheck size={22} className="care-heading-icon" aria-hidden="true" /></div>
      {!current ? <p className="care-empty">{t.quizNoQuestions}</p> : finished ? (
        <div className="care-quiz-complete" role="status">
          <span className="care-quiz-complete-icon" aria-hidden="true"><CheckCircle2 size={33} strokeWidth={1.6} /></span>
          <h3>{t.quizCompleteTitle}</h3><p>{t.quizCompleteBody}</p>
          <button type="button" className="button button-secondary" onClick={restart}><RotateCcw size={15} aria-hidden="true" />{t.quizRestart}</button>
        </div>
      ) : (
        <>
          <div className="care-quiz-progress"><span>{t.quizQuestion} {currentIndex + 1} {t.quizOf} {quiz.length}</span><div className="care-quiz-dots" aria-hidden="true">{quiz.map((_, index) => <span key={index} className={index <= currentIndex ? "is-current" : ""} />)}</div></div>
          <h3 className="care-quiz-question">{current.question}</h3>
          <div className="care-quiz-options" role="group" aria-label={current.question}>
            {current.options.map((option, index) => {
              const isCorrect = answered && index === current.correctAnswerIndex;
              const isWrong = answered && index === selectedIndex && !isCorrect;
              return <button type="button" key={index} disabled={answered} onClick={() => setSelectedIndex(index)} className={`care-quiz-option${isCorrect ? " is-correct" : ""}${isWrong ? " is-incorrect" : ""}`} aria-pressed={selectedIndex === index}><span className="care-option-index" aria-hidden="true">{isCorrect ? <Check size={14} /> : isWrong ? <X size={14} /> : String.fromCharCode(65 + index)}</span><span>{option}</span>{selectedIndex === index && <span className="care-answer-selected" aria-hidden="true" />}</button>;
            })}
          </div>
          <div aria-live="polite" aria-atomic="true">
            {answered && <div className={`care-quiz-feedback${correct ? " is-correct" : ""}`}><div className="care-feedback-title">{correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <BookOpenCheck size={18} aria-hidden="true" />}<strong>{correct ? t.quizCorrect : t.quizIncorrect}</strong></div><p>{current.explanation}</p><blockquote>{current.sourceQuote}</blockquote><button type="button" className="care-source-link" onClick={() => onInspect(current.sourceQuote)}><Link2 size={14} aria-hidden="true" />{t.viewOriginal}</button></div>}
          </div>
          <div className="care-quiz-footer"><p>{t.quizContentNote}</p>{answered && <button type="button" className="button button-primary" onClick={next}>{currentIndex + 1 === quiz.length ? t.quizFinish : t.quizNext}<ArrowRight size={16} aria-hidden="true" /></button>}</div>
        </>
      )}
    </section>
  );
}
