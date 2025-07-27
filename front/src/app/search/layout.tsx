import axios from "@/store/axios";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const { searchParams } = arguments[0] || {};
  const q = searchParams?.q || "";

  try {
    const data = await fetch(`http://localhost:5000/api/v1/search/all?q=${q}`, {
      method: "GET",
    });

    return {
      title: `${q} Search | TS - Social network site`,
      description: `Search results for ${q} on TS - Social network site`,
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
