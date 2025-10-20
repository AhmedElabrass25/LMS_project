const ExamResult = ({ result }) => {
  const score = result?.data?.score ?? 0;
  const total = result?.data?.totalPoints ?? 0;
  const percentage = ((score / total) * 100).toFixed(1);

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold text-green-600">Exam Completed!</h2>
      <p>
        Your Score: {score} / {total}
      </p>
      <p>Percentage: {percentage}%</p>
      <p className="text-gray-500">
        {score >= total / 2 ? "Passed" : "Failed"}
      </p>
    </div>
  );
};

export default ExamResult;
