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
import React, { useEffect } from "react";
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
      <section className="w-full h-full md:grid block md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr] gap-5">
        <aside className="hidden md:block">
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
                <Link href={`/post/create?company=${id}&user=${user.id}`}>
                  Create Post
                </Link>
              </Button>
            </CardHeader>
          </Card>
          {company.posts.length > 0 ? (
            company.posts.map((post: any) => (
              <Post key={post._id} post={post} />
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
