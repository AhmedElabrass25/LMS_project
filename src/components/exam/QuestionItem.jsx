const QuestionItem = ({ index, question, selected, onAnswer }) => (
  <div className="p-4 border rounded-lg shadow-sm">
    <h3 className="font-medium mb-2">
      {index}. {question.text}
    </h3>
    <div className="space-y-1">
      {question.options.map((opt, i) => (
        <label key={i} className="block">
          <input
            type="radio"
            name={question._id}
            value={opt}
            checked={selected === opt}
            onChange={() => onAnswer(question._id, opt)}
          />{" "}
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export default QuestionItem;
