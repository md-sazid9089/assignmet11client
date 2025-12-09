import { useState, useEffect } from 'react';

const Countdown = ({ targetDate, targetTime }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return {};
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  if (isExpired) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Departure time has passed
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      {Object.keys(timeLeft).map((interval) => (
        <div
          key={interval}
          className="flex flex-col items-center bg-gradient-primary text-white rounded-2xl p-4 min-w-[80px]"
        >
          <span className="text-3xl font-bold">{timeLeft[interval]}</span>
          <span className="text-sm uppercase">{interval}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
