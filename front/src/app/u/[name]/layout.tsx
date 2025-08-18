import axios from "@/store/axios";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: {
    name: string;
  };
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { name } = await Promise.resolve(params);

  try {
    const data = await fetch(
      `http://localhost:5000/api/v1/user/profile/${name}`,
      {
        method: "GET",
      }
    );

    const res = await data.json();

    const { user } = res;

    if (!user) {
      return {
        title: "User not found",
        description: "The user you are looking for does not exist.",
      };
    }

    return {
      title: `${user.name} | TS - Social network site`,
      description: `Explore ${user.name}'s profile on our social media platform.`,
    };
  } catch (error) {
    return {
      title: "Error",
      description: "An error occurred while fetching user data.",
    };
  }
}

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export default layout;
