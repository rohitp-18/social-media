"use client";

import FooterS from "@/components/footerS";
import Navbar from "@/components/introNavbar";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/feed");
    }
  }, [user]);
  return (
    <>
      <Navbar />
      <section
        className="hero relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Discover Social Connect</h1>
          <p className="text-xl mb-8 max-w-xl">
            Connect with people, friends & colleagues, chat with your
            connections, follow inspiration, write articles, and showcase your
            profile as your resume.
          </p>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Get Started
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <div className="grid grid-rows-[60px_1fr_60px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h1 className="text-4xl font-bold text-center sm:text-left">
            Welcome to Social Connect
          </h1>
          <p className="text-lg text-gray-700 text-center sm:text-left">
            Connect with people, friends & colleagues, chat with your
            connections, follow inspiration, write articles, and showcase your
            profile as your resume.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Connect with People
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              Chat with Connections
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg">
              Follow Inspiration
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
              Write Articles
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg">
              View Profile Resume
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Experience seamless networking and engaging conversations on our
            platform.
          </p>
        </main>
      </div>
      <FooterS />
    </>
  );
}
