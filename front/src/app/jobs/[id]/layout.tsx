import axios from "@/store/axios";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await Promise.resolve(params);

  try {
    const { data } = await axios.get(`/jobs/job/${id}`);
    const { job } = data;

    if (!job) {
      return {
        title: "Job not found",
        description: "The job you are looking for does not exist.",
      };
    }

    return {
      title: `${job.title} | TS - Social network site`,
      description: `Explore ${
        job.title
      }'s profile on our social media platform.${
        job.description ? ` Description: ${job.description}` : ""
      }`,
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
