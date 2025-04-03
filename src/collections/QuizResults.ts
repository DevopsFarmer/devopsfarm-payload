import { CollectionConfig } from "payload";

const QuizResponses: CollectionConfig = {
  slug: "quizResponses",
  fields: [
    { name: "email", type: "text", required: true },
    { name: "totalScore", type: "number", required: true }, 
    { name: "categoryScores", type: "json", required: true }, 
    { name: "quizId", type: "text", required: true },
    { name: "answers", type: "json", required: true },
    
    {
      name: "submittedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date(),
    },
  ],
};

export default QuizResponses;
