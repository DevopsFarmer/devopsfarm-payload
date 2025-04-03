'use client';
import React, { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizSidebar from './QuizSidebar';

interface QuizItem {
  id: string;
  title: string;
  categories: {
    name: string;
    id: string;
    category: string;
    questions: {
      id: string;
      question: string;
      correctAnswer: string;
      value: number;
      options: { option: string; id: string }[];
    }[];
  }[];
}

export default function QuizClient({ QuizItems }: { QuizItems: QuizItem[] }) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // Default 60 minutes

  // Load data from localStorage only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnswers(JSON.parse(localStorage.getItem('quizAnswers') || '{}'));
      setEmail(localStorage.getItem('userEmail') || '');
      setEmailSubmitted(!!localStorage.getItem('userEmail'));
      setCurrentQuestionIndex(Number(localStorage.getItem('currentQuestionIndex')) || 0);
      setTimeLeft(Number(localStorage.getItem('quizTimeLeft')) || 3600);
    }
  }, []);

  // Save answers to localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
    }
  }, [answers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEmail', email);
    }
  }, [email]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex]);

  // Timer logic: decrease every second
  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz(); // Auto-submit when time reaches 0
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (typeof window !== 'undefined') {
          localStorage.setItem('quizTimeLeft', newTime.toString());
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const allQuestions = QuizItems.flatMap((quiz) =>
    quiz.categories.flatMap((category) => category.questions)
  );

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = async () => {
    if (!email) {
      alert('Please enter your Gmail before submitting the quiz.');
      return;
    }

    let totalScore = 0;
    const categoryScores: { [key: string]: number } = {};

    QuizItems.forEach((quiz) => {
      quiz.categories.forEach((category) => {
        let categoryTotal = 0;
        category.questions.forEach((question) => {
          if (answers[question.id] === question.correctAnswer) {
            categoryTotal += question.value;
            totalScore += question.value;
          }
        });
        categoryScores[category.category] = categoryTotal;
      });
    });

    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        quizId: QuizItems[0]?.id,
        answers,
        categoryScores,
        totalScore,
      }),
    });

    if (!res.ok) {
      alert('Error submitting quiz.');
      return;
    }

    setSubmitted(true);
    alert('Quiz submitted successfully!');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quizAnswers');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('currentQuestionIndex');
      localStorage.removeItem('quizTimeLeft');
    }
  };

  // Function to format time into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="relative mt-10 p-6 bg-white shadow-lg rounded-lg flex">
      {!emailSubmitted ? (
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Enter Your Gmail</h2>
          <input
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-lg w-full mb-4"
          />
          <button
            onClick={() => setEmailSubmitted(true)}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg w-full"
          >
            Submit Email
          </button>
        </div>
      ) : submitted ? (
        <div className="w-full text-center">
          <h3 className="text-lg font-bold mt-4">Quiz Submitted!</h3>
        </div>
      ) : (
        <>
          {/* Quiz Title and Timer */}
          <div className="flex-1">
            <div className="flex justify-between items-center w-full mb-4">
            <h2 className="text-2xl font-bold text-blue-600">{QuizItems?.[0]?.title || 'Quiz Title'}</h2>

              <div className="text-xl font-bold text-red-600 bg-gray-200 px-4 py-2 rounded-lg">
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>

            <QuizQuestion
              question={allQuestions[currentQuestionIndex] ?? {
                id: '',
                question: 'Loading...',
                correctAnswer: '',
                value: 0,
                options: [],
              }}
              selectedAnswer={answers[allQuestions[currentQuestionIndex]?.id ?? ''] || ''}

              onSelectAnswer={handleAnswer}
              onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
              onPrevious={() => setCurrentQuestionIndex((prev) => prev - 1)}
              isLastQuestion={currentQuestionIndex === allQuestions.length - 1}
              isFirstQuestion={currentQuestionIndex === 0}
            />
          </div>

          {/* Quiz Sidebar */}
          <QuizSidebar
            categories={QuizItems[0]?.categories || []}
            currentQuestionIndex={currentQuestionIndex}
            allQuestions={allQuestions}
            answers={answers}
            scrollToQuestion={setCurrentQuestionIndex}
            submitQuiz={submitQuiz}
          />
        </>
      )}
    </div>
  );
}
