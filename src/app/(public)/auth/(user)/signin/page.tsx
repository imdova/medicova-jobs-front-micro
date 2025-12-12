import login from "@/components/images/login.svg";
import network from "@/components/images/network.svg";
import Image from "next/image";
import LoginForm from "./LoginForm";
import { getCookies } from "@/lib/cookies";

const Login = async ({ searchParams }: { searchParams: { error: string } }) => {
  const errorParam = searchParams.error;
  const error = errorParam ? await getCookies("user-error") : "";
  return (
    <div className="flex min-h-screen w-full items-center justify-center pt-[60px] md:px-5">
      {/* Main Content */}
      <div className="container mx-auto flex items-center justify-between gap-5 py-3 lg:max-w-[1170px]">
        {/* Left Section: Photo */}
        <div className="relative hidden flex-1 flex-col items-center justify-center px-2 md:flex">
          {/* Main Background Image */}
          <Image
            src={login}
            width={400}
            height={400}
            alt="Login Cover"
            priority={true}
            className="max-h-[80vh] w-full object-cover p-4"
          />

          {/* Overlaid Text */}
          <p className="absolute left-[20%] top-[18%] w-[250px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-[rgba(242,242,242,0.7)] p-2.5 text-center text-[14px] font-bold text-black shadow-md">
            Reach more than 100K+
            <span className="mt-1.5 block text-sm text-[#03353C]">
              Healthcare Professional
            </span>
          </p>

          {/* Overlaid Text */}
          <p className="absolute bottom-0 right-0 w-[250px] translate-x-[-10%] translate-y-[-20%] transform rounded-lg bg-[rgba(242,242,242,0.7)] p-2.5 text-center text-[12px] font-semibold shadow-md">
            “Great platform for the Healthcare Employers to find experienced
            healthcare Professionals“
          </p>

          {/* Additional Image */}
          <div className="absolute left-[10%] top-0">
            <Image
              src={network}
              alt="Additional Image"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Right Section: Login Form */}
        <LoginForm error={error?.replaceAll('"', "")} />
      </div>
    </div>
  );
};

export default Login;
