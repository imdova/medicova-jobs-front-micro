import { BaseHeaderProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

const MinimalHeader: React.FC<BaseHeaderProps> = ({ user }) => {
  const { assetsData } = useAppSelector((state) => state.branding.data);
  const { primaryLogo } = assetsData;
  return (
    <header className="fixed left-0 top-0 z-50 w-full transition-colors duration-300">
      <div className="container mx-auto px-6 lg:max-w-[1170px]">
        <div className="flex h-[60px] items-center">
          <Link href="/">
            <Image
              src={primaryLogo}
              alt="medicova logo"
              width={150}
              height={150}
            />
          </Link>
          <nav className="ml-auto flex space-x-4">
            <Link
              href="/auth/register"
              className="text-sm font-semibold hover:text-primary md:text-base"
            >
              Create Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default MinimalHeader;
