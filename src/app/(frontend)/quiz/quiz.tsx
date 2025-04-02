"use client";
import React, { useState } from "react";

interface QuizItem {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    correctAnswer: string;
    options: { option: string; id: string }[];
  }[];
}

export default function QuizClient({ QuizItems }: { QuizItems: QuizItem[] }) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Handle email submission
  const handleEmailSubmit = () => {
    if (!email.includes("@")) {
      alert("Please enter a valid Gmail address.");
      return;
    }
    setEmailSubmitted(true);
  };

  // Handle answer selection
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };


  const submitQuiz = async () => {
    try {
      if (!email) {
        alert("Please enter your Gmail before submitting the quiz.");
        return;
      }
  
      if (!QuizItems || QuizItems.length === 0) {
        alert("No quiz data available.");
        return;
      }
  
      console.log("Submitting:", { email, quizId: QuizItems[0]?.id, answers });
  
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, 
          quizId: QuizItems[0]?.id, // ✅ Use optional chaining to prevent error
          answers,
        }),
      });
  
      const responseData = await res.json();
      console.log("Response from API:", responseData);
  
      if (!res.ok) throw new Error(responseData.error || "Failed to submit answers");
  
      setSubmitted(true);
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting quiz.");
    }
  };
  
  
  

  return (
    <div className="max-w-3xl py-24 mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Step 1: Get User's Gmail */}
      {!emailSubmitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Enter Your Gmail</h2>
          <input
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-lg w-full mb-4"
          />
          <button
            onClick={handleEmailSubmit}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 w-full"
          >
            Submit Email
          </button>
        </div>
      ) : submitted ? (
        <p className="text-green-600 font-bold text-center">Quiz Submitted!</p>
      ) : (
        QuizItems.map((quiz) => (
          <div key={quiz.id} className="mb-6">
            {/* Quiz Title */}
            <h2 className="text-2xl font-bold text-blue-600">{quiz.title}</h2>

            {/* Quiz Questions */}
            {quiz.questions.map((q) => (
              <div key={q.id} className="mt-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">
                  {q.question}
                </h3>

                {/* Options */}
                <div className="mt-2 space-y-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className="block p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.option}
                        onChange={() => handleAnswer(q.id, opt.option)}
                        className="mr-2"
                      />
                      {opt.option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Submit Button */}
      {emailSubmitted && !submitted && (
        <button
          onClick={submitQuiz}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 w-full"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}


// "use client";
// import React, { useState } from "react";

// interface QuizItem {
//   id: string;
//   title: string;
//   questions: {
//     id: string;
//     question: string;
//     correctAnswer: string;
//     options: { option: string; id: string }[];
//   }[];
// }

// export default function QuizClient({ QuizItems }: { QuizItems: QuizItem[] }) {
//   const [answers, setAnswers] = useState<{ [key: string]: string }>({});
//   const [submitted, setSubmitted] = useState(false);

//   // Handle answer selection
//   const handleAnswer = (questionId: string, answer: string) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: answer }));
//   };

//   // Submit Quiz
//   const submitQuiz = async () => {
//     try {
//       const res = await fetch("/api/quiz", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: "user123",
//           quizId: QuizItems[0].id,
//           answers,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to submit answers");

//       setSubmitted(true);
//       alert("Quiz submitted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Error submitting quiz.");
//     }
//   };

//   return (
//     <div className="max-w-3xl py-24 mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       {submitted ? (
//         <p className="text-green-600 font-bold text-center">Quiz Submitted!</p>
//       ) : (
//         QuizItems.map((quiz) => (
//           <div key={quiz.id} className="mb-6">
//             {/* Quiz Title */}
//             <h2 className="text-2xl font-bold text-blue-600">{quiz.title}</h2>

//             {/* Quiz Questions */}
//             {quiz.questions.map((q) => (
//               <div key={q.id} className="mt-4 p-4 border rounded-lg">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {q.question}
//                 </h3>

//                 {/* Options */}
//                 <div className="mt-2 space-y-2">
//                   {q.options.map((opt) => (
//                     <label
//                       key={opt.id}
//                       className="block p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
//                     >
//                       <input
//                         type="radio"
//                         name={q.id}
//                         value={opt.option}
//                         onChange={() => handleAnswer(q.id, opt.option)}
//                         className="mr-2"
//                       />
//                       {opt.option}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))
//       )}

//       {/* Submit Button */}
//       {!submitted && (
//         <button
//           onClick={submitQuiz}
//           className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 w-full"
//         >
//           Submit Quiz
//         </button>
//       )}
//     </div>
//   );
// }
