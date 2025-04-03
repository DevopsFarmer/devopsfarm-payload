import React from "react";
import QuizClient from "./quiz";

const QuizServer = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  console.log("Fetching from:", `${API_URL}/api/quiz`);

  const res = await fetch(`${API_URL}/api/quiz`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error fetching quiz data:", res.status, await res.text());
    throw new Error("Failed to fetch quiz data");
  }

  const quizData = await res.json();
  return <QuizClient QuizItems={quizData} />;
};

export default QuizServer;
