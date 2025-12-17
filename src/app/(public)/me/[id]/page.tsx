import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import SeekerPublicProfile from "@/components/shared/seeker/public/SeekerPublicProfile";
import SeekerPrivateProfile from "@/components/shared/seeker/private/SeekerPrivateProfile";
import { Suspense } from "react";
import Loading from "@/components/loading/loading";

export const revalidate = 604800; // 7 days in seconds

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { id } = await params;
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
