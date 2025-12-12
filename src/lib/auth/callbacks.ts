import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { RoleState } from "@/types/next-auth";
import { handleSocialLogin } from "./utils";
import { cookies } from "next/headers";
import { Permission_Keys } from "@/constants/enums/Permission_Keys.enum";
import { divideName } from "@/util";
import { RegisterCategory } from "@/constants/enums/register-category.enum";

export const callbacks = {
  jwt: async ({
    token,
    user,
    account,
    trigger,
    session,
  }: {
    token: JWT;
    user: any;
    account: any;
    trigger?: "update" | "signIn" | "signUp" | undefined;
    session?: any;
  }) => {
    const { firstName, lastName } = divideName(user?.name);
    if (user && account) {
      token.id = user.id;
      token.email = user.email;
      token.firstName = user.firstName || firstName;
      token.lastName = user.lastName || lastName;
      token.image = user.image || user.image;
      token.userName = user.userName;
      token.category = user.category;
      token.companyId = user.companyId;
      token.hasCompany = user.hasCompany;
      token.accessToken = user.accessToken;
      token.permissions = user.permissions;
      token.type = user.type;
      //
      token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      if (account?.provider === "google") {
        const cookiesStore = cookies();
        const userData = cookiesStore.get("user")?.value;
        if (userData) {
          token = JSON.parse(userData);
          cookiesStore.delete("user");
          cookiesStore.delete("userType");
        }
      }
      return token;
    }

    if (trigger === "update") {
      if (session?.companyId) token.companyId = session.companyId;
      if (session?.hasCompany) token.hasCompany = session.hasCompany;
      if (session?.email) token.email = session.email;
      if (session?.firstName) token.firstName = session.firstName;
      if (session?.lastName) token.lastName = session.lastName;
      if (session?.userName) token.userName = session.userName;
      if (session?.image) token.image = session.image;
    }
    // if (
    //   token.accessTokenExpires &&
    //   Date.now() < (token.accessTokenExpires as number)
    // ) {
    // return token;
    // }
    // return refreshAccessToken(token);
    return token;
  },

  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      session.user.id = token.id as string | null;
      session.user.email = token.email as string | null;
      session.user.accessToken = token.accessToken as string;
      session.user.firstName = token.firstName as string | null;
      session.user.lastName = token.lastName as string | null;
      session.user.userName = token.userName as string | null;
      session.user.image = token.image as string | null;
      // session.user.phone = token.phone as string | null;
      session.user.category = token.category as RegisterCategory | null;
      session.user.companyId = token.companyId as string | null;
      session.user.hasCompany = token.hasCompany as boolean;
      session.user.permissions = token.permissions as Permission_Keys[];
      session.user.type = token.type as RoleState;
    }
    return session;
  },

  async signIn({ account, user }: { account: any; user: any }) {
    if (account?.provider === "google" || account?.provider === "facebook") {
      return await handleSocialLogin(user, account);
    }
    return true;
  },

  // async redirect({ url, baseUrl }: { url: any; baseUrl: any }) {
  //   // Redirect to /me/[name] after login
  //   if (url === "/me") {
  //     // const session = await getServerSession();
  //     // console.log("🚀 ~ redirect ~ session:", session);
  //   }
  //   return baseUrl;
  // },

  // async authorize(credentials: any, req: any) {
  //   const { state } = req.query; // Retrieve state from query params
  //   const parsedState = state ? JSON.parse(state) : null;

  //   console.log("Custom state:", parsedState);

  //   // Proceed with authentication
  //   return { id: 1, name: "User" }; // Example user
  // },
};
