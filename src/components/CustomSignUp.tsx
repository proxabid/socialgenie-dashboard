import { SignUp } from "@clerk/clerk-react";

export const CustomSignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
      <div className="w-full max-w-md p-8">
        <SignUp />
      </div>
    </div>
  );
};