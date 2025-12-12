import { Button } from "@mui/material";
import Image from "next/image";

interface EmptyCardProps {
  src: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}
const EmptyCard: React.FC<EmptyCardProps> = ({
  src,
  description,
  buttonText,
  onClick,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      {/* Image */}
      <Image src={src} alt={buttonText} width={180} height={180} />
      {/* Description */}
      <p className="mb-2 text-muted-foreground">{description}</p>
      {/* Button */}
      <Button variant="contained" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyCard;
