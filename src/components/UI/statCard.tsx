interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  bg: string;
  text: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  change,
  bg,
  text,
}) => {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-md ${bg} ${text}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm">{title}</p>
        <h3 className="font-bold">{value}</h3>
        <p className="text-xs text-primary">{change}</p>
      </div>
    </div>
  );
};

export default StatCard;
