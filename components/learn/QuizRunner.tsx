"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { submitQuiz } from "@/actions/learning";
import type { QuizForClient, QuizResult } from "@/types/learning";

interface QuizRunnerProps {
  quiz: QuizForClient;
  onPassed: () => void;
}

export default function QuizRunner({ quiz, onPassed }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;
  const answeredCurrent = Boolean(answers[question.id]);

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        const answered: { questionId: string; optionId: string }[] = [];
        for (const q of quiz.questions) {
          const optionId = answers[q.id];
          if (optionId) answered.push({ questionId: q.id, optionId });
        }
        const res = await submitQuiz({ testId: quiz.id, answers: answered });
        setResult(res);
        if (res.passed) onPassed();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't submit the quiz.");
      }
    });
  }

  function handleRetry() {
    setResult(null);
    setAnswers({});
    setIndex(0);
    setError(null);
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        {result.passed ? (
          <CheckCircle2 className="mx-auto w-12 h-12 text-emerald-500" aria-hidden="true" />
        ) : (
          <XCircle className="mx-auto w-12 h-12 text-red-500" aria-hidden="true" />
        )}
        <h3 className="mt-4 text-xl font-extrabold text-[#0F172A]">
          {result.passed ? "Quiz passed!" : "Not quite there yet"}
        </h3>
        <p className="mt-2 text-[#64748B]">
          You scored <span className="font-bold text-[#0F172A]">{result.score}%</span> &middot;
          passing score is {result.passingScore}%
        </p>
        {!result.passed && (
          <Button variant="primary" className="mt-6" onClick={handleRetry}>
            Retry Quiz
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <p className="mb-2 text-sm font-semibold text-[#64748B]">
        Question {index + 1} / {quiz.questions.length}
      </p>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#2563EB] transition-all"
          style={{ width: `${((index + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <h3 className="mb-4 text-lg font-bold text-[#0F172A]">{question.text}</h3>
      <div className="space-y-2.5" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const selected = answers[question.id] === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                selected
                  ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                  : "border-slate-200 text-[#334155] hover:border-slate-300"
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Back
        </Button>
        {isLast ? (
          <Button type="button" onClick={handleSubmit} loading={pending} disabled={!answeredCurrent}>
            Submit Quiz
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setIndex((i) => Math.min(quiz.questions.length - 1, i + 1))}
            disabled={!answeredCurrent}
          >
            Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
