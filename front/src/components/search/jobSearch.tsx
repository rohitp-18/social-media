import { User2, X } from "lucide-react";
import React, { Fragment } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import FooterS from "../footerS";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";

function JobSearch({ setType, selectValues }: any) {
  const { jobs } = useSelector((state: RootState) => state.search);
  return (
    <section className="grid grid-cols-[1fr_300px]  gap-4">
      <Card className="flex flex-col max-w-screen-md w-full gap-3 overflow-auto">
        <CardContent className="flex flex-col gap-2 py-5">
          {jobs.map((job) => (
            <Link href={`/jobs/${job._id}`} className="block" key={job._id}>
              <div className="flex gap-5 justify-between items-center">
                <div className="flex gap-5 items-center">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={job.company.avatar?.url} />
                    <AvatarFallback>
                      <User2 className="w-14 h-14 p-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="text-base text-primary font-bold">
                      {job.title}
                    </h3>
                    <span className="text-xs opacity-70">
                      {job.company.name} | {job.location}
                    </span>
                    <span className="text-xs opacity-50 pt-2">
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center h-full">
                  <X className="w-5 h-5" />
                </div>
              </div>
              <hr className="my-2" />
            </Link>
          ))}
        </CardContent>
      </Card>
      <aside>
        <FooterS />
      </aside>
    </section>
  );
}

export default JobSearch;
