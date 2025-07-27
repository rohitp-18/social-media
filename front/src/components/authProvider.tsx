"use client";

import { RootState } from "@/store/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./introNavbar";
import { useRouter } from "next/navigation";

function AuthProvider(props: any) {
  const router = useRouter();
  const { loading, user, login } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (!loading && !user) {
      if (props.url && !login) {
        console.log(props.url);
        router.push(props.url);
      }
    }
  }, [user, loading, login]);

  if (!loading && !user && !login) {
    return (
      <>
        <Navbar />
        <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full overflow-hidden py-5">
          <div className="container mx-auto">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="text-center">
                <h1 className="text-2xl font-bold">
                  Please log in to continue
                </h1>
                <p className="mt-4">
                  You need to be logged in to view this page.
                </p>
                <div className="mt-6">
                  <Link href="/login" className="text-blue-500 hover:underline">
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) return null;

  return <>{props.children}</>;
}

export default AuthProvider;
