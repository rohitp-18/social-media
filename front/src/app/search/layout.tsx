import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const q =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("q") || ""
      : "";

  return {
    title: q ? `Search results for "${q}"` : "Search",
    description: q
      ? `Find results for "${q}" across jobs, projects, people, groups, and posts.`
      : "Search for jobs, projects, people, groups, and posts.",
    openGraph: {
      title: q ? `Search results for "${q}"` : "Search",
      description: q
        ? `Find results for "${q}" across jobs, projects, people, groups, and posts.`
        : "Search for jobs, projects, people, groups, and posts.",
    },
  };
}

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export default layout;
