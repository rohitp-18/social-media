import axios from "@/store/axios";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params);

  try {
    const { data } = await axios.get(`/company/one/${id}`);
    const { company } = data;

    if (!company) {
      return {
        title: "Company not found",
        description: "The user you are looking for does not exist.",
      };
    }

    return {
      title: `${company.name} | TS - Social network site`,
      description: `Explore ${company.name}'s profile on our social media platform.`,
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
