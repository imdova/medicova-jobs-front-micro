// src/components/UserAvatars.tsx
import Image from "next/image";
import React from "react";

interface UserAvatarsProps {
  avatars: string[];
  current: number;
  total: number;
}

const UserAvatars: React.FC<UserAvatarsProps> = ({
  avatars,
  current,
  total,
}) => {
  const remaining = current - avatars.length;

  return (
    <div className="mt-4 flex items-center">
      <div className="flex -space-x-2 overflow-hidden">
        {avatars.map((avatar, index) => (
          <Image
            key={index}
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
            src={avatar}
            width={30}
            height={30}
            alt={`User ${index + 1}`}
          />
        ))}
        {remaining > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white">
            +{remaining}
          </span>
        )}
      </div>
      <span className="ml-2 text-sm text-gray-500">
        {current} of {total} Unlocks left {" - "}
      </span>
      <span className="ml-2 text-sm text-gray-500">
        {current + 10} of {total + 10} invites left
      </span>
    </div>
  );
};

export default UserAvatars;
