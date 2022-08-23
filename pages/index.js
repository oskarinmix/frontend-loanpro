import Link from "next/link";
import React from "react";

const Index = () => {
  return (
    <div className="flex w-screen min-h-screen items-center align-center bg-slate-900 text-white justify-center">
      Welcome to the Arithmetic Operations
      <Link href={"/login"}>
        <a className="text-md font-bold text-cyan-500">
          Please Login here to start
        </a>
      </Link>
    </div>
  );
};

export default Index;
