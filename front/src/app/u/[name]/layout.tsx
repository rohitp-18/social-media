import axios from "@/store/axios";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: {
    name: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

    // const {
    //   data: { user },
    // } = data;
    return {
      title: `${user.name} | TS`,
      description: `Explore ${user.name}'s profile on our social media platform.`,
    };
  } catch (error) {
    console.log(error);
    // Handle error appropriately
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
