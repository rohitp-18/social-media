"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navbar from "@/components/userNavbar";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import React, { useState } from "react";
import Invite from "@/components/company/invite";
import CreateForm from "@/components/company/createForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Page() {
  const [create, setCreate] = useState(1);

  const { company } = useSelector((state: RootState) => state.company);
  return (
    <>
      <Navbar />
      <main className="bg-[#f2f6f8] dark:bg-[#151515] w-full min-h-screen overflow-hidden py-5">
        <div className="container max-w-[1170px] mx-auto">
          {create === 2 ? (
            <CreateForm nextStep={() => setCreate(3)} edit={false} />
          ) : create === 1 ? (
            <section className="flex flex-col justify-center items-center gap-10">
              <div className="text-2xl font-extralight">
                Create a new Company
              </div>
              <div className="flex justify-center items-center w-full flex-wrap gap-5">
                <Card
                  className="min-w-64 hover:cursor-pointer"
                  onClick={() => setCreate(2)}
                >
                  <CardContent className="p-6 flex justify-center items-center flex-col">
                    <Building2 className="w-12 h-12 opacity-70" />
                    <h2 className="font-semibold text-center text-xl my-2">
                      Company
                    </h2>
                    <div className="font-normal text-center text-sm">
                      Create a new company
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          ) : (
            // send invitations to users to become members of the company
            company && <Invite company={company} />
          )}
        </div>
      </main>
    </>
  );
}

export default Page;
