import { BaseHeaderProps } from "@/types";
import Link from "next/link";

const CenteredHeader: React.FC<BaseHeaderProps> = ({ user }) => {
  return (
    <header className="w-full bg-gray-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center py-6">
          <Link href="/" className="mb-6 text-3xl font-bold text-gray-900">
            Logo
          </Link>
          <nav className="flex space-x-12">
            <Link
              href="/employer/profile"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              profile
            </Link>
            <Link
              href="/about"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/services"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CenteredHeader;
