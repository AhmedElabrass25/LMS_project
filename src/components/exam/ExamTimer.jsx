import { useEffect, useState } from "react";

const ExamTimer = ({ startTime, endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTime) return;
    const end = new Date(endTime).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) onExpire();
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;

  return (
    <div className="text-right text-lg font-semibold text-blue-600">
      ⏰ Time Left: {min}:{sec < 10 ? "0" + sec : sec}
    </div>
  );
};

export default ExamTimer;
