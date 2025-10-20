const ExamHeader = ({ name, description, classLevel }) => (
  <div className="border-b pb-3">
    <h2 className="text-xl font-bold text-blue-700">{name}</h2>
    <p className="text-gray-600">{description}</p>
    <p className="text-sm text-gray-500">Class: {classLevel}</p>
  </div>
);

export default ExamHeader;
