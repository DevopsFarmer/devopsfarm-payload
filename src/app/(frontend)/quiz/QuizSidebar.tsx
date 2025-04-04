import React from 'react';

interface SidebarProps {
  categories: {
    name: string;
    id: string;
    category: string;
    questions: {
      id: string;
      question: string;
    }[];
  }[];
  currentQuestionIndex: number;
  allQuestions: { id: string }[];
  answers: { [key: string]: string };
  scrollToQuestion: (index: number) => void;
  submitQuiz: () => void; 
  isSubmitting: boolean;
}

const QuizSidebar: React.FC<SidebarProps> = ({
  categories,
  currentQuestionIndex,
  allQuestions,
  answers,
  scrollToQuestion,
  submitQuiz, 
  isSubmitting,
}) => {
  return (
    <div className=" bg-gray-100 shadow-lg rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-center">Questions</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id}>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">{category.category}</h4>
              <div className="grid grid-cols-5 gap-2">
                {category.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(allQuestions.indexOf(q))}
                    className={`w-8 h-8 text-sm text-black font-semibold rounded-full border ${
                      allQuestions.indexOf(q) === currentQuestionIndex
                        ? 'bg-blue-500 text-white'
                        : answers[q.id]
                          ? 'bg-green-500 text-white'
                          : 'hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Submit Button at the Bottom */}
      <div className="mt-6">
      <button
          onClick={submitQuiz}
          className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </button>

      </div>
    </div>
  );
};

export default QuizSidebar;




