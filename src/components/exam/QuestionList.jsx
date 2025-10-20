const QuestionList = ({ questions, answers, onAnswer }) => {
  if (!questions.length)
    return <p className="text-gray-600">No questions available.</p>;

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div
          key={q._id}
          className="border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <h3 className="font-semibold text-lg mb-2">
            {index + 1}. {q.text}
          </h3>

          {/* MULTIPLE CHOICE QUESTION */}
          {q.type === "multiple-choice" && (
            <div className="space-y-2">
              {q.options.map((option, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() => onAnswer(q._id, option)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* SHORT ANSWER QUESTION */}
          {q.type === "short-answer" && (
            <textarea
              placeholder="Type your answer..."
              value={answers[q._id] || ""}
              onChange={(e) => onAnswer(q._id, e.target.value)}
              className="w-full border p-2 rounded-md mt-2"
            />
          )}

          {/* TRUE / FALSE QUESTION */}
          {q.type === "true-false" && (
            <div className="space-y-2">
              {["True", "False"].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() => onAnswer(q._id, option)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
