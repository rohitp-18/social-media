"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  // Optional: Automatically redirect after some time
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-7xl font-bold text-red-500 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <div className="my-6 h-px bg-gray-200" />
        <p className="text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-gray-500">
          You will be redirected to the home page in 5 seconds...
        </p>
        <div className="mt-6">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
