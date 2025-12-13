interface StreakBarProps {
  streak: number;
}

const StreakBar = ({ streak }: StreakBarProps) => {
  const filled = streak % 8 +1;
  const total = 7;

  return (
    <div className="relative w-32 h-32 flex justify-center items-center">
      {[...Array(total)].map((_, i) => {
        const isFilled = i < filled;
        const angle = i * (360 / total);

        return (
          <div
            key={i}
            className={`absolute h-6 w-2 rounded-full transition-all duration-300 ${
              isFilled ? "bg-green-500" : "bg-gray-50"
            }`}
            style={{
              transform: `
                rotate(${angle}deg) 
                translateY(-45px)
              `,
            }}
          ></div>
        );
      })}
      <div className="absolute bg-transparent w-24 h-24 text-4xl rounded-full flex items-center justify-center">
        🔥
      </div>
    </div>
  );
};

export default StreakBar;
