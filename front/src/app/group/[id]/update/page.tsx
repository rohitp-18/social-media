"use client";

import AuthProvider from "@/components/authProvider";
import GroupForm from "@/components/group/groupForm";
import { PrimaryLoader } from "@/components/loader";
import Navbar from "@/components/userNavbar";
import { clearGroupError, getSingleGroup } from "@/store/group/groupSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { group, loading, error } = useSelector(
    (state: RootState) => state.group
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      typeof id === "string" && dispatch(getSingleGroup(id));
    }
  }, [id]);

  useEffect(() => {
    if (group && user) {
      if (!group.admin.some((admin: any) => admin._id === user._id)) {
        router.push(`/group/${id}`);
      } else {
        setIsAdmin(true);
      }
    }
  }, [group, user]);

  useEffect(() => {
    if (error && !group) {
      toast.error(error, { position: "top-center" });
      dispatch(clearGroupError());
      router.back();
    }
  }, [error]);

  return (
    <AuthProvider url={`/group/${id}`}>
      <Navbar />
      {loading ? (
        <PrimaryLoader />
      ) : group && isAdmin ? (
        <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full min-h-screen overflow-hidden py-5">
          <div className="container max-w-[1170px] mx-auto">
            <GroupForm edit={true} id={id as string} />
          </div>
        </main>
      ) : (
        <PrimaryLoader />
      )}
    </AuthProvider>
  );
}

export default Page;
