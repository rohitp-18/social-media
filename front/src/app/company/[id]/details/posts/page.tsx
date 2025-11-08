"use client";

import CompanyCard from "@/components/company/companyCard";
import CompanyWrapper from "@/components/company/companyWraper";
import Post from "@/components/post";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { getSingleCompany } from "@/store/company/companySlice";
import { RootState, AppDispatch } from "@/store/store";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Page() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { company, posts } = useSelector((state: RootState) => state.company);

  useEffect(() => {
    if (id) {
      dispatch(getSingleCompany(id as string));
    }
  }, [id, user]);

  if (!company) return null;
  return (
    <CompanyWrapper>
      <section className="w-full h-full lg:grid block lg:grid-cols-[280px_1fr] gap-5">
        <aside className="hidden lg:block">
          <CompanyCard />
        </aside>
        <section className="w-full h-full flex flex-col gap-5">
          <Card className="w-full">
            <CardHeader className="flex justify-between flex-row gap-4 items-center">
              <Link href={`/company/${id}`} className="flex items-center gap-2">
                <MoveLeft className="w-5 h-5 opacity-80 hover:opacity-100" />
                <h2 className="text-base font-semibold">Back</h2>
              </Link>
              <Button className="border-primary">
                {user && (
                  <Link href={`/post/create?company=${id}&user=${user._id}`}>
                    Create Post
                  </Link>
                )}
              </Button>
            </CardHeader>
          </Card>
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <Fragment key={post._id}>
                <Post cardClass={"w-full"} post={post} />
              </Fragment>
            ))
          ) : (
            <Card className="w-full min-h-40 flex items-center justify-center p-5">
              <p className="text-gray-500 dark:text-gray-400">
                No posts available for this company.
              </p>
            </Card>
          )}
        </section>
      </section>
    </CompanyWrapper>
  );
}

export default Page;
