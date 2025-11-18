import { LucideIcon } from 'lucide-react';

interface Trend {
  value: string;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  trend?: Trend;
  icon: LucideIcon;
  iconColor: string; // e.g., "text-blue-600"
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  // Map icon color to background color
  const getBackgroundColor = (colorClass: string): string => {
    const colorMap: { [key: string]: string } = {
      'text-blue-600': 'bg-blue-100',
      'text-green-600': 'bg-green-100',
      'text-purple-600': 'bg-purple-100',
      'text-yellow-600': 'bg-yellow-100',
      'text-red-600': 'bg-red-100',
      'text-orange-600': 'bg-orange-100',
      'text-pink-600': 'bg-pink-100',
      'text-indigo-600': 'bg-indigo-100',
      'text-teal-600': 'bg-teal-100',
      'text-cyan-600': 'bg-cyan-100',
    };
    return colorMap[colorClass] || 'bg-gray-100';
  };

  const bgColor = getBackgroundColor(iconColor);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor}`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
