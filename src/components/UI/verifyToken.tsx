import { MousePointerClick } from "lucide-react";

import { CheckCircle, Mail } from "lucide-react";
import Step from "./step";
import { cn } from "@/util";

type VerifyTokenProps = {
  title?: string;
  description?: string;
  Icon?: React.ElementType;
  className?: string;
};
const VerifyToken: React.FC<VerifyTokenProps> = ({
  title = "Registration Successful 🎉",
  description = "You&apos;re almost there! Just one more step to get started.",
  Icon = CheckCircle,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-xl space-y-8 rounded-3xl bg-white p-10 text-center shadow-2xl",
        className,
      )}
    >
      <Icon className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-lg text-gray-600">{description}</p>

      <div className="space-y-6 text-left">
        <Step
          number={1}
          title="Check your inbox"
          description="We've sent a verification email to the address you provided."
          Icon={Mail}
        />
        <Step
          number={2}
          title="Open the verification email"
          description="Find the email with the subject 'Verify your account'."
          Icon={MousePointerClick}
        />
        <Step
          number={3}
          title="Click the verification link"
          description="This will activate your account and log you in."
          Icon={CheckCircle}
        />
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Didn&apos;t receive the email? Check your spam folder
        {/* <a href="#" className="text-indigo-600 hover:underline">
            resend it
          </a> */}
        .
      </p>
    </div>
  );
};

export default VerifyToken;
