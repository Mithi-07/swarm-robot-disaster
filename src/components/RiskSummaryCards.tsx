"use client";

interface RiskSummaryCardsProps {
  lowCount: number;
  mediumCount: number;
  highCount: number;
}

const cards = [
  {
    label: "Low Risk",
    key: "low" as const,
    gradient: "from-emerald-600/20 to-emerald-800/10",
    border: "border-emerald-500/20",
    textColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-400">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Medium Risk",
    key: "medium" as const,
    gradient: "from-amber-600/20 to-amber-800/10",
    border: "border-amber-500/20",
    textColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-amber-400">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "High Risk",
    key: "high" as const,
    gradient: "from-red-600/20 to-red-800/10",
    border: "border-red-500/20",
    textColor: "text-red-400",
    iconBg: "bg-red-500/20",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-400">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export default function RiskSummaryCards({ lowCount, mediumCount, highCount }: RiskSummaryCardsProps) {
  const counts = { low: lowCount, medium: mediumCount, high: highCount };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`group relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-br ${card.gradient} p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{card.label}</span>
            </div>
            <span className={`text-3xl font-black ${card.textColor}`}>
              {counts[card.key]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
