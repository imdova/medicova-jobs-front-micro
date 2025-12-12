import { BaseHeaderProps } from "@/types";
import Link from "next/link";
import { getNavLinks } from "@/config/routeConfigs";
import { isCurrentPage } from "@/util";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

const DarkHeader: React.FC<BaseHeaderProps> = ({ user, pathname }) => {
  const links = getNavLinks(user, pathname);
  const { assetsData } = useAppSelector((state) => state.branding.data);
  const { primaryLogo } = assetsData;

  return (
    <header className="flex h-[70px] w-full items-center justify-center bg-primary">
      <div className="container px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <Image
              src={primaryLogo}
              alt="medicova logo"
              width={150}
              height={150}
            />
          </Link>
          <nav className="ml-8 flex space-x-6">
            {links.map((link, i) => {
              const path = link.pattern || link.path;
              const isPage = isCurrentPage(pathname, path);
              return (
                <Link
                  key={i}
                  href={link?.path || "#"}
                  className={`${isPage ? "text-white" : ""} text-gray-100 hover:text-white`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DarkHeader;
