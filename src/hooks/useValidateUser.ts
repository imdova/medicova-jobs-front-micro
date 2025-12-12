'use client';
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { getMe } from "@/lib/access";

const useValidateUser = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    const validateUser = async () => {
      try {
        // Check if session is loaded
        if (status !== "authenticated" || !session?.user?.id) {
          return;
        }

        // Fetch the currently signed-in user from your API
        const response = await getMe();

        if (!response.success) {
          throw new Error("Failed to fetch user");
        }
        const apiUser = response.data;
        // Compare user IDs
        if (apiUser.id !== session.user.id) {
          console.warn("User ID mismatch. Logging out...");
          await signOut();
        }
      } catch (error) {
        console.error("Error validating user:", error);
        // Log the user out on error
        await signOut();
      }
    };

    validateUser();
  }, [session, status]);
};

export default useValidateUser;
