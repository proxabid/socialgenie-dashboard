import { SignIn } from "@clerk/clerk-react";

export const CustomSignIn = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1516553174826-d05833723cd4?q=80&w=2334&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
      }}
    >
      <div className="w-full max-w-md p-8">
        <SignIn />
      </div>
    </div>
  );
};