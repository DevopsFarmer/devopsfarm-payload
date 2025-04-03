import React from 'react';

interface QuestionProps {
  question: {
    id: string;
    question: string;
    correctAnswer: string;
    value: number;
    options: { option: string; id: string }[];
  };
  selectedAnswer: string;
  onSelectAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

const QuizQuestion: React.FC<QuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
}) => {
  return (
    <div className="mt-4 p-4 border rounded-lg">
      {/* Question Text */}
      <h3 className="text-lg font-semibold text-gray-800">{question.question}</h3>

      {/* Answer Options */}
      <div className="mt-2 space-y-2">
        {question.options.map((opt) => (
          <label key={opt.option} className="block p-2 text-black border rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="radio"
              name={question.id}
              value={opt.option}
              checked={selectedAnswer === opt.option}
              onChange={() => onSelectAnswer(question.id, opt.option)}
              className="mr-2"
            />
            {opt.option}
          </label>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className={`px-4 py-2 font-semibold rounded-lg ${isFirstQuestion ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={isLastQuestion}
          className={`px-4 py-2 font-semibold rounded-lg ${isLastQuestion ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
