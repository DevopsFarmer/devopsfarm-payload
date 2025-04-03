'use client'
import React, { useState, useEffect } from 'react'

interface QuizItem {
  id: string
  title: string
  categories: {
    name: string
    id: string
    category: string
    questions: {
      id: string
      question: string
      correctAnswer: string
      value: number
      options: { option: string; id: string }[]
    }[]
  }[]
}

export default function QuizClient({ QuizItems }: { QuizItems: QuizItem[] }) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>(() =>
    JSON.parse(localStorage.getItem('quizAnswers') || '{}'),
  )
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(3600)

  useEffect(() => {
    setAnswers(JSON.parse(localStorage.getItem('quizAnswers') || '{}'))
    setTimeLeft(parseInt(localStorage.getItem('quizTimeLeft') || '3600', 10))
  }, [])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev
      if (newTheme) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return newTheme
    })
  }

  // Extract all questions
  const allQuestions = QuizItems.flatMap((quiz) =>
    quiz.categories.flatMap((category) => category.questions),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        const updatedTime = prevTime - 1
        localStorage.setItem('quizTimeLeft', updatedTime.toString())
        return updatedTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (questionId: string, answer: string, goToNext: boolean = false) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: answer }
      localStorage.setItem('quizAnswers', JSON.stringify(updatedAnswers))
      return updatedAnswers
    })

    if (goToNext) {
      setCurrentQuestionIndex((prev) => Math.min(prev + 1, allQuestions.length - 1))
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    alert('Quiz submitted!')
    localStorage.removeItem('quizAnswers')
    localStorage.removeItem('quizTimeLeft')
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="flex flex-col items-center mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg max-w-3xl mx-auto transition-colors">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg"
      >
        {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <h2 className="text-2xl font-bold text-blue-600">{QuizItems?.[0]?.title || 'Quiz Title'}</h2>
      <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
        Time Left: {formatTime(timeLeft)}
      </p>

      {allQuestions.length > 0 &&
        currentQuestionIndex !== undefined &&
        currentQuestionIndex < allQuestions.length && (
          <div key={allQuestions[currentQuestionIndex]?.id} className="mb-6 w-full">
            <h3 className="text-lg font-semibold text-gray-800">
              {allQuestions[currentQuestionIndex]?.question}
            </h3>
            <div className="mt-2 space-y-2">
              {allQuestions[currentQuestionIndex]?.options?.map((opt) => (
                <label
                  key={opt?.id}
                  className="block p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name={allQuestions[currentQuestionIndex]?.id}
                    value={opt?.option}
                    checked={answers[allQuestions[currentQuestionIndex]?.id ?? ''] === opt?.option}
                    onChange={() =>
                      handleAnswer(allQuestions[currentQuestionIndex]?.id ?? '', opt.option, true)
                    }
                    className="mr-2"
                  />
                  {opt?.option}
                </label>
              ))}
            </div>
          </div>
        )}

      <div className="flex justify-between w-full mt-4">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestionIndex < allQuestions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
          >
            Submit Quiz
          </button>
        )}
      </div>

      {/* Question Numbers at Bottom */}
      <div className="mt-6 w-full bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 text-center">
        <h3 className="text-sm font-semibold mb-2 dark:text-white">Questions</h3>
        <div className="grid grid-cols-6 gap-2">
          {allQuestions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 text-sm font-semibold rounded-full border 
                ${index === currentQuestionIndex ? 'bg-blue-500 text-white' : answers[q.id] ? 'bg-green-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 'use client';
// import React, { useState, useEffect } from 'react';
// import QuizQuestion from './QuizQuestion';
// import QuizSidebar from './QuizSidebar';

// interface QuizItem {
//   id: string;
//   title: string;
//   categories: {
//     name: string;
//     id: string;
//     category: string;
//     questions: {
//       id: string;
//       question: string;
//       correctAnswer: string;
//       value: number;
//       options: { option: string; id: string }[];
//     }[];
//   }[];
// }

// export default function QuizClient({ QuizItems }: { QuizItems: QuizItem[] }) {
//   const [answers, setAnswers] = useState<{ [key: string]: string }>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [email, setEmail] = useState('');
//   const [emailSubmitted, setEmailSubmitted] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(3600); // Default 60 minutes

//   // Load data from localStorage only on the client
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setAnswers(JSON.parse(localStorage.getItem('quizAnswers') || '{}'));
//       setEmail(localStorage.getItem('userEmail') || '');
//       setEmailSubmitted(!!localStorage.getItem('userEmail'));
//       setCurrentQuestionIndex(Number(localStorage.getItem('currentQuestionIndex')) || 0);
//       setTimeLeft(Number(localStorage.getItem('quizTimeLeft')) || 3600);
//     }
//   }, []);

//   // Save answers to localStorage when updated
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('quizAnswers', JSON.stringify(answers));
//     }
//   }, [answers]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('userEmail', email);
//     }
//   }, [email]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
//     }
//   }, [currentQuestionIndex]);

//   // Timer logic: decrease every second
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       submitQuiz(); // Auto-submit when time reaches 0
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         const newTime = prevTime - 1;
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('quizTimeLeft', newTime.toString());
//         }
//         return newTime;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const allQuestions = QuizItems.flatMap((quiz) =>
//     quiz.categories.flatMap((category) => category.questions)
//   );

//   const handleAnswer = (questionId: string, answer: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: answer,
//     }));
//   };

//   const submitQuiz = async () => {
//     if (!email) {
//       alert('Please enter your Gmail before submitting the quiz.');
//       return;
//     }

//     let totalScore = 0;
//     const categoryScores: { [key: string]: number } = {};

//     QuizItems.forEach((quiz) => {
//       quiz.categories.forEach((category) => {
//         let categoryTotal = 0;
//         category.questions.forEach((question) => {
//           if (answers[question.id] === question.correctAnswer) {
//             categoryTotal += question.value;
//             totalScore += question.value;
//           }
//         });
//         categoryScores[category.category] = categoryTotal;
//       });
//     });

//     const res = await fetch('/api/quiz', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email,
//         quizId: QuizItems[0]?.id,
//         answers,
//         categoryScores,
//         totalScore,
//       }),
//     });

//     if (!res.ok) {
//       alert('Error submitting quiz.');
//       return;
//     }

//     setSubmitted(true);
//     alert('Quiz submitted successfully!');
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('quizAnswers');
//       localStorage.removeItem('userEmail');
//       localStorage.removeItem('currentQuestionIndex');
//       localStorage.removeItem('quizTimeLeft');
//     }
//   };

//   // Function to format time into MM:SS
//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   return (
//     <div className="relative mt-10 p-6 bg-white shadow-lg rounded-lg flex">
//       {!emailSubmitted ? (
//         <div className="w-full text-center">
//           <h2 className="text-2xl font-bold mb-4">Enter Your Gmail</h2>
//           <input
//             type="email"
//             placeholder="Enter your Gmail"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="p-2 border rounded-lg w-full mb-4"
//           />
//           <button
//             onClick={() => setEmailSubmitted(true)}
//             className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg w-full"
//           >
//             Submit Email
//           </button>
//         </div>
//       ) : submitted ? (
//         <div className="w-full text-center">
//           <h3 className="text-lg font-bold mt-4">Quiz Submitted!</h3>
//         </div>
//       ) : (
//         <>
//           {/* Quiz Title and Timer */}
//           <div className="flex-1">
//             <div className="flex justify-between items-center w-full mb-4">
//             <h2 className="text-2xl font-bold text-blue-600">{QuizItems?.[0]?.title || 'Quiz Title'}</h2>

//               <div className="text-xl font-bold text-red-600 bg-gray-200 px-4 py-2 rounded-lg">
//                 Time Left: {formatTime(timeLeft)}
//               </div>
//             </div>

//             <QuizQuestion
//               question={allQuestions[currentQuestionIndex] ?? {
//                 id: '',
//                 question: 'Loading...',
//                 correctAnswer: '',
//                 value: 0,
//                 options: [],
//               }}
//               selectedAnswer={answers[allQuestions[currentQuestionIndex]?.id ?? ''] || ''}

//               onSelectAnswer={handleAnswer}
//               onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
//               onPrevious={() => setCurrentQuestionIndex((prev) => prev - 1)}
//               isLastQuestion={currentQuestionIndex === allQuestions.length - 1}
//               isFirstQuestion={currentQuestionIndex === 0}
//             />
//           </div>

//           {/* Quiz Sidebar */}
//           <QuizSidebar
//             categories={QuizItems[0]?.categories || []}
//             currentQuestionIndex={currentQuestionIndex}
//             allQuestions={allQuestions}
//             answers={answers}
//             scrollToQuestion={setCurrentQuestionIndex}
//             submitQuiz={submitQuiz}
//           />
//         </>
//       )}
//     </div>
//   );
// }
