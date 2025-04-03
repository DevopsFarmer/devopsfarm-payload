import React from "react";
import QuizClient from "./quiz";

const QuizServer = async () => {
  const res = await fetch(`http://localhost:3000/api/quiz`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch quiz data");

  const quizData = await res.json();
  console.log("-=-=-===-======--=",quizData)
  return <QuizClient QuizItems={quizData} />;
};

export default QuizServer;
