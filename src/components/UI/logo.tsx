"use client";

import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

interface LogoProps {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: "primary" | "secondary" | "footer";
}

const Logo: React.FC<LogoProps> = ({ className, alt, width, height, type }) => {
  const { assetsData } = useAppSelector((state) => state.branding.data);
  const { primaryLogo, secondaryLogo, footerIcon } = assetsData;
  switch (type) {
    case "primary":
      return (
        <Image src={primaryLogo} alt="Logo" width={width} height={height} />
      );

    case "secondary":
      return (
        <Image src={secondaryLogo} alt="Logo" width={width} height={height} />
      );

    case "footer":
      return (
        <Image src={footerIcon} alt="Logo" width={width} height={height} />
      );

    default:
      return (
        <Image src={primaryLogo} alt="Logo" width={width} height={height} />
      );
  }
};

export default Logo;
