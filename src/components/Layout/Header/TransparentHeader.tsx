import { BaseHeaderProps } from "@/types";
import Link from "next/link";
import { getNavLinks } from "@/config/routeConfigs";
import HeaderAction from "./HeaderAction";
import useScrollDetection from "@/hooks/useScrollDetection";
import { isCurrentPage } from "@/util";
import SideBarDrawer from "../SideBar/mobile-side-bar";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

const TransparentHeader: React.FC<BaseHeaderProps> = ({ user, pathname }) => {
  const isScrolled = useScrollDetection();
  const links = getNavLinks(user, pathname);
  const { assetsData } = useAppSelector((state) => state.branding.data);
  const { primaryLogo, secondaryLogo } = assetsData;
  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 ${isScrolled ? "bg-white text-black shadow-md" : "bg-transparent text-white"}`}
    >
      <div className="container mx-auto px-6 lg:max-w-[1170px]">
        <div className="flex h-[70px] items-center">
          <div className="flex flex-1 items-center justify-start md:hidden">
            <SideBarDrawer user={user} pathname={pathname} />
          </div>
          <Link href="/">
            <Image
              src={isScrolled ? primaryLogo : secondaryLogo}
              alt="medicova logo"
              width={150}
              height={150}
            />
          </Link>
          <nav className="ml-auto flex flex-1 items-center justify-end space-x-8 md:justify-end">
            <div className="hidden items-center space-x-8 md:flex">
              {links.map((link, i) => {
                const path = link.pattern || link.path;
                const isPage = isCurrentPage(pathname, path);
                return (
                  <Link
                    key={i}
                    href={link.path || "#"}
                    className={`font-medium ${isPage ? "text-primary" : "hover:text-primary"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <HeaderAction user={user} pathname={pathname} />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TransparentHeader;
