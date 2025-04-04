'use client'
import React, { useState, useEffect } from 'react'
import QuizQuestion from './QuizQuestion'
import QuizSidebar from './QuizSidebar'

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
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [name, setName] = useState('')
  const [pnumber, setPnumber] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [termsTimeLeft, setTermsTimeLeft] = useState(600)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizTimeLeft, setQuizTimeLeft] = useState<number | null>(null)

  const [error, setError] = useState('')

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@gmail\.com$/

    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid Gmail address.')
      return
    }

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!pnumber.trim() || pnumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    setError('')
    setShowTerms(true)
  }

  // Load data from localStorage only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnswers(JSON.parse(localStorage.getItem('quizAnswers') || '{}'))
      setEmail(localStorage.getItem('userEmail') || '')
      setName(localStorage.getItem('userName') || '')
      setPnumber(localStorage.getItem('userPhone') || '')
      setEmailSubmitted(
        !!localStorage.getItem('userEmail') &&
          !!localStorage.getItem('userName') &&
          !!localStorage.getItem('userPhone'),
      )

      setCurrentQuestionIndex(Number(localStorage.getItem('currentQuestionIndex')) || 0)
    }
  }, [])

  // Save answers to localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizAnswers', JSON.stringify(answers))
    }
  }, [answers])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userName', name)
      localStorage.setItem('userPhone', pnumber)
    }
  }, [email, name, pnumber])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString())
    }
  }, [currentQuestionIndex])



  const allQuestions = QuizItems.flatMap((quiz) =>
    quiz.categories.flatMap((category) => category.questions),
  )

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const submitQuiz = async () => {
    if (isSubmitting) return // Prevent multiple clicks

    setIsSubmitting(true) // Start loading
    if (!email) {
      alert('Please enter your Gmail before submitting the quiz.')
      return
    }

    let totalScore = 0
    const categoryScores: { [key: string]: number } = {}

    QuizItems.forEach((quiz) => {
      quiz.categories.forEach((category) => {
        let categoryTotal = 0
        category.questions.forEach((question) => {
          if (answers[question.id] === question.correctAnswer) {
            categoryTotal += question.value
            totalScore += question.value
          }
        })
        categoryScores[category.category] = categoryTotal
      })
    })

    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        pnumber,
        name,
        quizId: QuizItems[0]?.id,
        answers,
        categoryScores,
        totalScore,
      }),
    })

    if (!res.ok) {
      alert('Error submitting quiz.')
      return
    }

    setSubmitted(true)
    alert('Quiz submitted successfully!')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quizAnswers')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('currentQuestionIndex')
    }
  }

  useEffect(() => {
    if (!showTerms) return

    const interval = setInterval(() => {
      setTermsTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setEmailSubmitted(true) // move to quiz page
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showTerms])

  useEffect(() => {
    if (quizTimeLeft === null || submitted) return
  
    if (quizTimeLeft <= 0) {
      submitQuiz()
      return
    }
  
    const timer = setInterval(() => {
      setQuizTimeLeft((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
  
    return () => clearInterval(timer)
  }, [quizTimeLeft, submitted])

  


  useEffect(() => {
    if (submitted) return
  
    const storedStartTime = localStorage.getItem('quizStartTime')
    if (storedStartTime) {
      const elapsed = Math.floor((Date.now() - parseInt(storedStartTime)) / 1000)
      const remaining = 3600 - elapsed
      if (remaining <= 0) {
        submitQuiz()
      } else {
        setQuizTimeLeft(remaining)
      }
    }
  }, [submitted])
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <div className="relative p-4 md:p-6  bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
      {submitted ? (
       <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
       <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md w-full">
         <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Thank You!</h2>
         <p className="text-gray-700 mb-2">You have successfully submitted the quiz.</p>
         <p className="text-sm text-gray-500">
           Your responses have been recorded. You may now close the quiz or wait for results.
         </p>
       </div>
     </div>
     
      ) : !emailSubmitted ? (
        !showTerms ? (
          // Email Form
          <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
            <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg text-center">
              <h2 className="text-2xl text-black font-bold mb-4">Enter Your Email</h2>

              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 text-black border rounded-lg w-full mb-2"
              />

              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 text-black border rounded-lg w-full mb-2"
              />

              <div className="flex items-center justify-center mb-2">
                <span className="p-2 bg-gray-200 text-black border border-r-0 rounded-l-lg">
                  +91
                </span>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter your Mobile Number"
                  value={pnumber}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, '')
                    if (input.length <= 10) {
                      setPnumber(input)
                    }
                  }}
                  className="p-2 text-black border border-l-0 rounded-r-lg w-full"
                  required
                />
              </div>

              {error && <p className="text-red-500 mb-2">{error}</p>}

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg w-full"
              >
                Submit Email
              </button>
            </div>
          </div>
        ) : (
          // Terms & Conditions
          <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">Quiz Terms & Conditions</h2>
              <p className="mb-4 text-gray-700 max-w-2xl mx-auto">
                Please read the following terms before starting the quiz:
              </p>
              <ul className="text-left text-gray-700 max-w-xl mx-auto list-disc pl-6 space-y-2 mb-6">
                <li>Quiz duration is limited. You cannot pause the timer.</li>
                <li>Each question carries the marks as mentioned.</li>
                <li>Do not refresh or close the browser during the quiz.</li>
                <li>Your score will be submitted automatically after time ends.</li>
              </ul>
              <p className="text-lg font-semibold text-red-600 mb-4">
                Starting Quiz In: {formatTime(termsTimeLeft)}
              </p>
              <button
               onClick={() => {
                setEmailSubmitted(true)
                setTermsTimeLeft(0)
                const now = Date.now()
                localStorage.setItem('quizStartTime', now.toString())
                setQuizTimeLeft(3600) // 1 hour
              }}
              
              
                className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg"
              >
                Start Quiz Now
              </button>
              <p className="text-sm text-gray-500">
                The quiz will start automatically when the timer ends.
              </p>
            </div>
          </div>
        )
      ) : submitted ? (
        <div className="w-full text-center">
          <h3 className="text-lg font-bold mt-4">Quiz Submitted!</h3>
        </div>
      ) : (
        // Quiz UI
        <>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-blue-600">
                {QuizItems?.[0]?.title || 'Quiz Title'}
              </h2>
              <div className="text-lg md:text-xl font-bold text-red-600 bg-gray-200 px-4 py-2 rounded-lg mt-2 md:mt-0">
  Time Left: {quizTimeLeft !== null ? formatTime(quizTimeLeft) : '1:00:00'}
</div>

              
            </div>
            <QuizQuestion
              question={
                allQuestions[currentQuestionIndex] ?? {
                  id: '',
                  question: 'Loading...',
                  correctAnswer: '',
                  value: 0,
                  options: [],
                }
              }
              selectedAnswer={answers[allQuestions[currentQuestionIndex]?.id ?? ''] || ''}
              onSelectAnswer={handleAnswer}
              onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
              onPrevious={() => setCurrentQuestionIndex((prev) => prev - 1)}
              isLastQuestion={currentQuestionIndex === allQuestions.length - 1}
              isFirstQuestion={currentQuestionIndex === 0}
            />
          </div>
          <div className="w-full md:w-1/4 md:ml-6 mt-4 md:mt-0">
            <QuizSidebar
              categories={QuizItems[0]?.categories || []}
              currentQuestionIndex={currentQuestionIndex}
              allQuestions={allQuestions}
              answers={answers}
              scrollToQuestion={setCurrentQuestionIndex}
              submitQuiz={submitQuiz}
              isSubmitting={isSubmitting}
              isSubmitted={false}
            />
          </div>
        </>
      )}
    </div>
  )
}
