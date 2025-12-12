import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import SeekerPublicProfile from "@/components/shared/seeker/public/SeekerPublicProfile";
import SeekerPrivateProfile from "@/components/shared/seeker/private/SeekerPrivateProfile";
import { Suspense } from "react";
import Loading from "@/components/loading/loading";

export const revalidate = 3600 * 24 * 7;

const Page = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const isPublic = searchParams?.public;
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const isMe = isPublic === "true" ? false : id === user?.userName;

  return isMe ? (
    <SeekerPrivateProfile />
  ) : (
    <Suspense fallback={<Loading />}>
      <SeekerPublicProfile userId={id} companyId={user?.companyId} />
    </Suspense>
  );
};

export default Page;
