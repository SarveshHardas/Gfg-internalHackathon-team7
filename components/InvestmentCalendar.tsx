import React from "react";

type InvestmentCalendarProps = {
  investmentDates: string[];
};

const InvestmentCalendar: React.FC<InvestmentCalendarProps> = ({ investmentDates }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl w-fit">
      <h2 className="text-xl font-semibold text-center mb-3">
        {today.toLocaleString("default", { month: "long" })} {year}
      </h2>

      <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-sm">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateString = formatDate(day);
          const invested = investmentDates.includes(dateString);

          return (
            <div
              key={day}
              className={`
                h-10 flex items-center justify-center rounded-full
                transition-all cursor-pointer text-sm
                ${invested ? "bg-green-500 text-white font-bold" : "bg-gray-100"}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestmentCalendar;