import { Button } from "@/components/UI/button";
import NotificationDropdown from "@/components/UI/NotificationDropdown";
import UserDropdown from "@/components/UI/UserDropdown";
import { User } from "next-auth";
import Link from "next/link";

interface UserActionProps {
  user?: User;
  pathname?: string;
}

const HeaderAction: React.FC<UserActionProps> = ({ user, pathname }) => {
  if (user && user.id) {
    return (
      <div className="flex items-center gap-3 text-inherit">
        <NotificationDropdown pathname={pathname} user={user} />
        <UserDropdown user={user} />
      </div>
    );
  } else {
    return (
      <div className="flex gap-3">
        <Button asChild variant="ghost">
          <Link href="/auth/register">Sign Up</Link>
        </Button>
        <Button asChild variant="default">
          <Link href="/auth/signin">Login</Link>
        </Button>
      </div>
    );
  }
};

export default HeaderAction;
