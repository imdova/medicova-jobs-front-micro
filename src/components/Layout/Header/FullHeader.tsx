import { BaseHeaderProps } from "@/types";
import Link from "next/link";
import { getNavLinks } from "@/config/routeConfigs";
import HeaderAction from "./HeaderAction";
import { isCurrentPage } from "@/util";
import SideBarDrawer from "../SideBar/mobile-side-bar";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

const FullHeader: React.FC<BaseHeaderProps> = ({ user, pathname }) => {
  const links = getNavLinks(user, pathname);
  const { assetsData } = useAppSelector((state) => state.branding.data);
  const { primaryLogo } = assetsData;
  return (
    <header className="sticky top-0 z-50 w-full bg-white text-black shadow-md transition-colors duration-300">
      <div className="container mx-auto px-6 lg:max-w-[1170px]">
        <div className="flex h-[70px] items-center">
          <div className="flex flex-1 items-center justify-start md:hidden">
            <SideBarDrawer user={user} pathname={pathname} />
          </div>

          <Link href="/">
            <Image
              src={primaryLogo}
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
                    href={link?.path || "#"}
                    className={`text-sm font-medium ${isPage ? "text-primary" : "hover:text-primary"}`}
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

export default FullHeader;
