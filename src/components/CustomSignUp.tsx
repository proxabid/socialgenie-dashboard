import { SignUp } from "@clerk/clerk-react";

export const CustomSignUp = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignUp />
    </div>
  );
};