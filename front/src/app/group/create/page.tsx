"use client";

import AuthProvider from "@/components/authProvider";
import GroupForm from "@/components/group/groupForm";
import Navbar from "@/components/userNavbar";
import React from "react";

function Page() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full min-h-screen overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          <GroupForm edit={false} />
        </div>
      </main>
    </AuthProvider>
  );
}

export default Page;
