interface InfoBlockProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
}

const InfoBlock = ({ label, value, className = "" }: InfoBlockProps) =>
  value ? (
    <div className={`flex flex-col ${className}`}>
      {typeof label === "string" ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : (
        label
      )}
      <span className="text-sm font-semibold text-main">{value}</span>
    </div>
  ) : null;

export default InfoBlock;
